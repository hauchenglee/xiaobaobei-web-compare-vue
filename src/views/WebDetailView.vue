<template>
    <div class="web-detail-view">
        <header class="header">
            <div class="container">
                <div class="breadcrumb">
                    <router-link to="/">首頁</router-link> > {{ currentWebsite.name }}
                </div>
                <div class="website-header">
                    <div class="website-icon">{{ currentWebsite.icon }}</div>
                    <div class="website-info">
                        <h1>{{ currentWebsite.name }}</h1>
                        <p>監控 {{ currentWebsite.totalPages }} 個重要政策頁面</p>
                    </div>
                </div>
            </div>
        </header>

        <main class="container">
            <div class="main-content">
                <div class="control-bar">
                    <div class="view-controls">
                        <button
                            v-for="filter in filters"
                            :key="filter.key"
                            class="filter-btn"
                            :class="{ active: activeFilter === filter.key }"
                            @click="setActiveFilter(filter.key)"
                        >
                            {{ filter.label }} ({{ filter.count }})
                        </button>
                    </div>
                    <button class="add-page-btn" @click="handleAddPage">
                        ➕ 新增監控頁面
                    </button>
                </div>

                <div class="pages-grid">
                    <div
                        v-for="page in filteredPages"
                        :key="page.id"
                        class="page-card"
                        @click="navigateToPageDetail(page.id)"
                    >
                        <div class="page-header">
                            <div class="page-title">
                                <h3>{{ page.title }}</h3>
                                <a href="#" class="page-url">{{ page.category }}</a>
                            </div>
                            <span class="status-badge" :class="getStatusClass(page.status)">
                {{ getStatusText(page.status) }}
              </span>
                        </div>
                        <div class="page-stats">
                            <div class="stat-item">
                                <span class="stat-number">{{ page.stats.weeklyChanges }}</span>
                                <div class="stat-label">本週變化</div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{{ page.stats.totalChanges }}</span>
                                <div class="stat-label">總變化數</div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{{ page.stats.monitorDays }}</span>
                                <div class="stat-label">監控天數</div>
                            </div>
                        </div>
                        <div class="recent-changes">
                            <h4>最近變化</h4>
                            <div
                                v-for="change in page.recentChanges"
                                :key="change.id"
                                class="change-item"
                            >
                                <div class="change-icon" :class="getChangeIconClass(change.type)">
                                    {{ getChangeIcon(change.type) }}
                                </div>
                                <div class="change-content">
                                    <div class="change-text">{{ change.description }}</div>
                                    <div class="change-time">{{ change.timeAgo }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="last-check">最後檢查：{{ page.lastCheck }}</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'WebDetailView',
    setup() {
        const router = useRouter()
        const route = useRoute()

        const activeFilter = ref('all')

        const currentWebsite = reactive({
            id: 1,
            name: '新北市政府',
            icon: '新',
            totalPages: 8
        })

        const filters = ref([
            { key: 'all', label: '全部', count: 8 },
            { key: 'changed', label: '有變化', count: 3 },
            { key: 'unchanged', label: '無變化', count: 5 },
            { key: 'error', label: '錯誤', count: 0 }
        ])

        const pages = ref([
            {
                id: 1,
                title: '身心障礙補助',
                category: '社會局 > 身心障礙福利服務',
                status: 'changed',
                stats: {
                    weeklyChanges: 6,
                    totalChanges: 45,
                    monitorDays: 15
                },
                recentChanges: [
                    {
                        id: 1,
                        type: 'modified',
                        description: '補助金額調整：輕度障礙由4,700調整為5,200元',
                        timeAgo: '2小時前'
                    },
                    {
                        id: 2,
                        type: 'added',
                        description: '新增線上申請服務功能',
                        timeAgo: '5小時前'
                    }
                ],
                lastCheck: '2分鐘前'
            },
            {
                id: 2,
                title: '老人福利津貼',
                category: '社會局 > 老人福利服務',
                status: 'normal',
                stats: {
                    weeklyChanges: 0,
                    totalChanges: 23,
                    monitorDays: 30
                },
                recentChanges: [
                    {
                        id: 1,
                        type: 'modified',
                        description: '申請流程說明更新',
                        timeAgo: '3天前'
                    }
                ],
                lastCheck: '5分鐘前'
            },
            {
                id: 3,
                title: '青年創業貸款',
                category: '經發局 > 產業發展',
                status: 'changed',
                stats: {
                    weeklyChanges: 2,
                    totalChanges: 18,
                    monitorDays: 22
                },
                recentChanges: [
                    {
                        id: 1,
                        type: 'modified',
                        description: '貸款利率由2.5%調整為2.3%',
                        timeAgo: '1天前'
                    },
                    {
                        id: 2,
                        type: 'added',
                        description: '新增科技業優惠方案',
                        timeAgo: '1天前'
                    }
                ],
                lastCheck: '1分鐘前'
            },
            {
                id: 4,
                title: '托育補助',
                category: '社會局 > 托育服務',
                status: 'normal',
                stats: {
                    weeklyChanges: 0,
                    totalChanges: 12,
                    monitorDays: 25
                },
                recentChanges: [
                    {
                        id: 1,
                        type: 'added',
                        description: '新增常見問答章節',
                        timeAgo: '5天前'
                    }
                ],
                lastCheck: '3分鐘前'
            }
        ])

        // 計算屬性
        const filteredPages = computed(() => {
            if (activeFilter.value === 'all') return pages.value
            if (activeFilter.value === 'changed') {
                return pages.value.filter(page => page.status === 'changed')
            }
            if (activeFilter.value === 'unchanged') {
                return pages.value.filter(page => page.status === 'normal')
            }
            if (activeFilter.value === 'error') {
                return pages.value.filter(page => page.status === 'error')
            }
            return pages.value
        })

        // 方法
        const setActiveFilter = (filterKey) => {
            activeFilter.value = filterKey
        }

        const getStatusClass = (status) => {
            const statusClasses = {
                'normal': 'status-active',
                'changed': 'status-changed',
                'error': 'status-error'
            }
            return statusClasses[status] || 'status-active'
        }

        const getStatusText = (status) => {
            const statusTexts = {
                'normal': '正常',
                'changed': '有變化',
                'error': '錯誤'
            }
            return statusTexts[status] || '正常'
        }

        const getChangeIconClass = (type) => {
            const iconClasses = {
                'added': 'change-added',
                'modified': 'change-modified',
                'removed': 'change-removed'
            }
            return iconClasses[type] || 'change-modified'
        }

        const getChangeIcon = (type) => {
            const icons = {
                'added': '+',
                'modified': 'M',
                'removed': '−'
            }
            return icons[type] || 'M'
        }

        const handleAddPage = () => {
            console.log('新增監控頁面功能')
            alert('新增監控頁面功能開發中...')
        }

        const navigateToPageDetail = (pageId) => {
            router.push(`/page/${pageId}`)
        }

        const loadWebsiteData = async () => {
            try {
                const websiteId = route.params.id
                // 模擬API調用載入網站數據
                console.log('載入網站數據:', websiteId)
            } catch (error) {
                console.error('載入網站數據失敗:', error)
            }
        }

        // 生命周期
        onMounted(() => {
            loadWebsiteData()
        })

        return {
            activeFilter,
            currentWebsite,
            filters,
            pages,
            filteredPages,
            setActiveFilter,
            getStatusClass,
            getStatusText,
            getChangeIconClass,
            getChangeIcon,
            handleAddPage,
            navigateToPageDetail
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.web-detail-view {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.breadcrumb {
    margin-bottom: 1rem;
    opacity: 0.8;
}

.breadcrumb a {
    color: white;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.website-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.website-icon {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
}

.website-info h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.website-info p {
    opacity: 0.9;
    font-size: 1.1rem;
}

.main-content {
    margin: 2rem auto;
}

.control-bar {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.view-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.filter-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.add-page-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-page-btn:hover {
    transform: translateY(-2px);
}

.pages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;
}

.page-card {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.page-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.page-title {
    flex: 1;
}

.page-title h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
}

.page-url {
    color: #667eea;
    font-size: 0.85rem;
    text-decoration: none;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-active {
    background: #dcfce7;
    color: #16a34a;
}

.status-changed {
    background: #fef3c7;
    color: #d97706;
}

.status-error {
    background: #fee2e2;
    color: #dc2626;
}

.page-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-item {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
}

.stat-number {
    font-size: 1.4rem;
    font-weight: 700;
    display: block;
    color: #667eea;
}

.stat-label {
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.25rem;
}

.recent-changes {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
}

.recent-changes h4 {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
    font-weight: 600;
}

.change-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
}

.change-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    flex-shrink: 0;
    margin-top: 0.1rem;
}

.change-added { background: #22c55e; }
.change-modified { background: #f59e0b; }
.change-removed { background: #ef4444; }

.change-content {
    flex: 1;
}

.change-text {
    color: #4b5563;
    margin-bottom: 0.25rem;
}

.change-time {
    color: #9ca3af;
    font-size: 0.75rem;
}

.last-check {
    color: #9ca3af;
    font-size: 0.8rem;
    text-align: center;
    border-top: 1px solid #f3f4f6;
    padding-top: 1rem;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .website-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }

    .control-bar {
        flex-direction: column;
        gap: 1rem;
    }

    .view-controls {
        flex-wrap: wrap;
        justify-content: center;
    }

    .pages-grid {
        grid-template-columns: 1fr;
    }
}
</style>