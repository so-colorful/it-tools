import { BrandGitlab } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
    name: 'Gitlab merge requests',
    path: '/gitlab-merge-requests',
    description:
        'Gitlab merge requests, supporting batch initiation, batch merge, and query merge records.',
    keywords: ['git', 'gitlab', 'merge', 'merge-requests', 'merge requests'],
    component: () => import('./gitlab-merge-requests.vue'),
    icon: BrandGitlab,
});
