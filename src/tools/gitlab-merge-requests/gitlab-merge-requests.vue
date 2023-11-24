<script setup lang="ts">
import {getMergeRequests} from "@/tools/gitlab-merge-requests/api/merge_request";
import {getProject} from "@/tools/gitlab-merge-requests/api/project";
import { VXETable } from 'vxe-table'
const stateOptions = [
  { label: '全部', value: 'all' },
  { label: '待合并', value: 'opened' },
  { label: '已合并', value: 'merged' },
  { label: '已锁定', value: 'locked' },
  { label: '已关闭', value: 'closed' }
];
let tableData = ref([]);
let state = ref('all');
let search = ref('');
let token = ref($cookies.get('token'));
let projects = ref({});
let loading = ref(false);
const page = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})
const handleQuery = () => {
  loading.value = true
  const params = {
    per_page: page.pageSize,
    page: page.currentPage,
    scope: 'all',
    state: state.value,
    search: search.value
  };
  getMergeRequests(token.value, params).then(resp => {
    console.log(resp)
    const { data, headers } = resp
    tableData.value = data;
    page.total = parseInt(headers['x-total'])
    handleProjectName()
  }).catch((error) => {
    tableData.value = []
    page.total = 0
    VXETable.modal.message({ content: error.response.data.message, status: 'error' })
  }).finally(() => {
    loading.value = false
  })
}

const handleProjectName = () => {
  const value = tableData.value;
  value.forEach(item => {
    const projectId = item.project_id;
    const project = projects.value[projectId];
    if (project) {
      item.projectName = project.name
    } else {
      getProject(token.value, item.project_id).then(resp => {
        const { data } = resp
        item.projectName = data.name
        projects.value[projectId] = { name: data.name }
      })
    }
  })
}

const tokenChange = () => {
  $cookies.config("1y");
  $cookies.set("token", token.value);
  handleQuery();
}

onMounted(() => {
  if (token.value) {
    handleQuery()
  }
})

watch(state, () => {
  handleQuery()
})
</script>

<template>
  <div id="gitlab-body">
    <c-card id="gitlab-body-condition">
      <div flex class="condition-row">
        <div flex-1>
          <c-input-text label="标题/描述" mb-2
                        label-position="left"
                        label-align="right"
                        label-width="80px"
                        placeholder="请输入标题/描述"
                        v-model:value="search"
                        @change="handleQuery"/>
        </div>
        <div flex-1>
          <c-select :options="stateOptions"
                    label="状态"
                    mb-2
                    label-position="left"
                    label-width="50px"
                    label-align="right"
                    placeholder="清选择状态"
                    v-model:value="state"
                    @change="handleQuery"/>
        </div>
      </div>
      <div flex class="condition-row">
        <div flex-1>
          <c-input-text label="访问令牌"
                        mb-2 label-position="left"
                        label-align="right"
                        label-width="80px"
                        placeholder="请输入访问令牌"
                        v-model:value="token"
                        @change="tokenChange"/>
        </div>
        <div flex-1 text-right>
          <c-button variant="basic" type="primary" size="medium" mx-1 @click="handleQuery">查询</c-button>
        </div>
      </div>
    </c-card>
    <c-card>
      <vxe-table :data="tableData" border="none" :loading="loading" >
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="title" title="标题" show-overflow="tooltip"></vxe-column>
        <vxe-column field="projectName" title="项目名称"></vxe-column>
        <vxe-column field="source_branch" title="源分支"></vxe-column>
        <vxe-column field="target_branch" title="目标分支"></vxe-column>
        <vxe-column field="author" title="作者">
          <template #default="{ row }">
            <span>{{row.author.name}}</span>
          </template>
        </vxe-column>
        <vxe-column field="state" title="状态">
          <template #default="{ row }">
            <span v-if="row.state === 'opened'">待合并</span>
            <span v-else-if="row.state === 'merged'">已合并</span>
            <span v-else-if="row.state === 'locked'">已锁定</span>
            <span v-else-if="row.state === 'closed'">已关闭</span>
          </template>
        </vxe-column>
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            <span>{{new Date(row.created_at).toLocaleString()}}</span>
          </template>
        </vxe-column>
        <vxe-column title="操作"></vxe-column>
      </vxe-table>
      <vxe-pager :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
                 v-model:current-page="page.currentPage" v-model:page-size="page.pageSize" :total="page.total"
                 @page-change="handleQuery"/>
    </c-card>
  </div>
</template>

<style  lang="less">
#gitlab-body {
  flex: 1;
  #gitlab-body-condition {
    margin-bottom: 10px;
    .condition-row {
      gap: 15px;
    }
  }
}
</style>
