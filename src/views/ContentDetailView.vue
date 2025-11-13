<template>
    <div class="content-detail-view">
        <header class="header">
            <div class="container">
                <div class="breadcrumb">
                    <router-link to="/">首頁</router-link> >
                    <router-link to="/website/1">新北市政府</router-link> >
                    {{ pageInfo.title }}
                </div>
                <div class="page-header">
                    <div class="page-info">
                        <h1>{{ pageInfo.title }}</h1>
                        <p>{{ pageInfo.description }}</p>
                        <div class="page-url">{{ pageInfo.url }}</div>
                    </div>
                    <div class="page-stats">
                        <div class="stat-item">
                            <span class="stat-number">{{ pageInfo.stats.totalChanges }}</span>
                            <div class="stat-label">總變化</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">{{ pageInfo.stats.monitorDays }}</span>
                            <div class="stat-label">監控天數</div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">{{ pageInfo.stats.weeklyChanges }}</span>
                            <div class="stat-label">本週變化</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="container">
            <div class="main-content">
                <div class="timeline-controls">
                    <div class="timeline-filters">
                        <button
                            v-for="filter in timelineFilters"
                            :key="filter.key"
                            class="filter-btn"
                            :class="{ active: activeTimelineFilter === filter.key }"
                            @click="setActiveTimelineFilter(filter.key)"
                        >
                            {{ filter.label }}
                        </button>
                    </div>
                    <button class="export-btn" @click="handleExportReport">
                        📊 匯出報告
                    </button>
                </div>

                <div class="comparison-view">
                    <div class="comparison-header">
                        <div class="version-selector">
                            <div class="version-group">
                                <label class="version-label">比較版本</label>
                                <select
                                    class="version-select"
                                    v-model="selectedOldVersion"
                                    @change="updateComparison"
                                >
                                    <option
                                        v-for="version in availableVersions"
                                        :key="version.id"
                                        :value="version.id"
                                    >
                                        {{ version.label }}
                                    </option>
                                </select>
                            </div>
                            <div class="version-group">
                                <label class="version-label">對比版本</label>
                                <select
                                    class="version-select"
                                    v-model="selectedNewVersion"
                                    @change="updateComparison"
                                >
                                    <option
                                        v-for="version in availableVersions"
                                        :key="version.id"
                                        :value="version.id"
                                    >
                                        {{ version.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="changes-summary">
                            <div class="summary-item">
                                <div class="summary-icon added-icon">+</div>
                                <span>{{ changesSummary.added }}項新增</span>
                            </div>
                            <div class="summary-item">
                                <div class="summary-icon modified-icon">M</div>
                                <span>{{ changesSummary.modified }}項修改</span>
                            </div>
                            <div class="summary-item">
                                <div class="summary-icon removed-icon">−</div>
                                <span>{{ changesSummary.removed }}項移除</span>
                            </div>
                        </div>
                    </div>

                    <div class="comparison-content">
                        <div class="version-panel">
                            <div class="version-header">
                                <span class="version-badge version-old">舊版本</span>
                                <span class="version-date">{{ oldVersionDate }}</span>
                            </div>

                            <div
                                v-for="section in oldVersionContent"
                                :key="section.id"
                                class="content-section"
                            >
                                <div class="section-header">
                                    <h4>{{ section.title }}</h4>
                                    <span
                                        v-if="section.changeType"
                                        class="change-badge"
                                        :class="getChangeBadgeClass(section.changeType)"
                                    >
                    {{ getChangeText(section.changeType) }}
                  </span>
                                </div>
                                <div v-if="section.text" class="content-text" v-html="section.text"></div>
                                <ul v-if="section.list" class="content-list">
                                    <li v-for="item in section.list" :key="item.id" v-html="item.text"></li>
                                </ul>
                            </div>
                        </div>

                        <div class="version-panel">
                            <div class="version-header">
                                <span class="version-badge version-new">新版本</span>
                                <span class="version-date">{{ newVersionDate }}</span>
                            </div>

                            <div
                                v-for="section in newVersionContent"
                                :key="section.id"
                                class="content-section"
                            >
                                <div class="section-header">
                                    <h4>{{ section.title }}</h4>
                                    <span
                                        v-if="section.changeType"
                                        class="change-badge"
                                        :class="getChangeBadgeClass(section.changeType)"
                                    >
                    {{ getChangeText(section.changeType) }}
                  </span>
                                </div>
                                <div v-if="section.text" class="content-text" v-html="section.text"></div>
                                <ul v-if="section.list" class="content-list">
                                    <li v-for="item in section.list" :key="item.id" v-html="item.text"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Timeline Sidebar -->
            <div class="timeline-sidebar" v-if="showTimelineSidebar">
                <div class="timeline-title">變化歷程</div>

                <div
                    v-for="item in timelineItems"
                    :key="item.id"
                    class="timeline-item"
                    :class="{ active: item.active }"
                    @click="selectTimelineItem(item)"
                >
                    <div class="timeline-dot" :class="item.importance === 'major' ? 'dot-major' : 'dot-minor'"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">{{ item.date }}</div>
                        <div class="timeline-description">{{ item.description }}</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'ContentDetailView',
    setup() {
        const router = useRouter()
        const route = useRoute()

        const activeTimelineFilter = ref('all')
        const selectedOldVersion = ref('2')
        const selectedNewVersion = ref('4')
        const showTimelineSidebar = ref(true)

        const pageInfo = reactive({
            id: 1,
            title: '身心障礙補助',
            description: '社會局身心障礙福利服務',
            url: 'https://www.ntpc.gov.tw/ch/home.jsp?id=28&parentpath=0,6,27',
            stats: {
                totalChanges: 45,
                monitorDays: 15,
                weeklyChanges: 6
            }
        })

        const timelineFilters = ref([
            { key: 'all', label: '全部變化' },
            { key: 'major', label: '重大變化' },
            { key: 'text', label: '文字調整' },
            { key: 'added', label: '新增內容' },
            { key: 'removed', label: '移除內容' }
        ])

        const availableVersions = ref([
            { id: '1', label: '2024-10-15 (原始版本)' },
            { id: '2', label: '2024-10-28 (第1次更新)' },
            { id: '3', label: '2024-11-01 (第2次更新)' },
            { id: '4', label: '2024-11-13 (最新版本)' }
        ])

        const changesSummary = reactive({
            added: 3,
            modified: 2,
            removed: 1
        })

        const oldVersionDate = ref('2024-11-01')
        const newVersionDate = ref('2024-11-13')

        const oldVersionContent = ref([
            {
                id: 1,
                title: '申請資格',
                text: '設籍新北市並領有身心障礙手冊或證明者',
                list: [
                    { id: 1, text: '輕度障礙者家庭總收入未超過最低生活費標準2.5倍' },
                    { id: 2, text: '中度以上障礙者家庭總收入未超過最低生活費標準<span class="highlight-removed">3.5倍</span>' }
                ]
            },
            {
                id: 2,
                title: '補助金額',
                list: [
                    { id: 1, text: '輕度障礙：每月<span class="highlight-removed">4,700元</span>' },
                    { id: 2, text: '中度障礙：每月<span class="highlight-removed">7,000元</span>' },
                    { id: 3, text: '重度障礙：每月<span class="highlight-removed">8,500元</span>' }
                ]
            },
            {
                id: 3,
                title: '申請文件',
                changeType: 'removed',
                list: [
                    { id: 1, text: '申請表正本' },
                    { id: 2, text: '戶口名簿影本' },
                    { id: 3, text: '身心障礙手冊影本' }
                ]
            }
        ])

        const newVersionContent = ref([
            {
                id: 1,
                title: '申請資格',
                changeType: 'modified',
                text: '設籍新北市<span class="highlight-added">滿6個月</span>並領有身心障礙手冊或證明者',
                list: [
                    { id: 1, text: '輕度障礙者家庭總收入未超過最低生活費標準2.5倍' },
                    { id: 2, text: '中度以上障礙者家庭總收入未超過最低生活費標準<span class="highlight-modified">4倍</span>' }
                ]
            },
            {
                id: 2,
                title: '補助金額',
                changeType: 'modified',
                list: [
                    { id: 1, text: '輕度障礙：每月<span class="highlight-modified">5,200元</span>' },
                    { id: 2, text: '中度障礙：每月<span class="highlight-modified">7,500元</span>' },
                    { id: 3, text: '重度障礙：每月<span class="highlight-modified">9,000元</span>' },
                    { id: 4, text: '<span class="highlight-added">極重度障礙：每月10,000元</span>' }
                ]
            },
            {
                id: 3,
                title: '線上申請服務',
                changeType: 'added',
                text: '即日起開放線上申請，民眾可透過市政府官網「我的新北市」服務平台進行申請。'
            },
            {
                id: 4,
                title: '快速審查機制',
                changeType: 'added',
                text: '針對急需救助案件，提供7個工作日內完成審查的快速通道。'
            },
            {
                id: 5,
                title: '復審程序',
                changeType: 'added',
                text: '申請人若對審查結果有異議，可在收到通知後30日內提出復審申請。'
            }
        ])

        const timelineItems = ref([
            {
                id: 1,
                date: '2024-11-13 14:30',
                description: '大幅度政策調整：補助金額全面提升，新增線上申請功能',
                importance: 'major',
                active: true
            },
            {
                id: 2,
                date: '2024-11-05 09:15',
                description: '聯絡資訊更新',
                importance: 'minor',
                active: false
            },
            {
                id: 3,
                date: '2024-11-01 16:20',
                description: '申請資格調整：新增設籍滿6個月要求',
                importance: 'major',
                active: false
            },
            {
                id: 4,
                date: '2024-10-28 11:45',
                description: '頁面樣式調整',
                importance: 'minor',
                active: false
            },
            {
                id: 5,
                date: '2024-10-15 10:00',
                description: '開始監控此頁面',
                importance: 'minor',
                active: false
            }
        ])

        // 方法
        const setActiveTimelineFilter = (filterKey) => {
            activeTimelineFilter.value = filterKey
        }

        const getChangeBadgeClass = (changeType) => {
            const badgeClasses = {
                'added': 'badge-added',
                'modified': 'badge-modified',
                'removed': 'badge-removed'
            }
            return badgeClasses[changeType] || 'badge-modified'
        }

        const getChangeText = (changeType) => {
            const changeTexts = {
                'added': '新增',
                'modified': '已修改',
                'removed': '已移除'
            }
            return changeTexts[changeType] || '已修改'
        }

        const updateComparison = () => {
            console.log('更新比較:', selectedOldVersion.value, selectedNewVersion.value)
            // 這裡可以添加更新比較內容的邏輯
        }

        const handleExportReport = () => {
            console.log('匯出報告')
            alert('匯出報告功能開發中...')
        }

        const selectTimelineItem = (item) => {
            timelineItems.value.forEach(i => i.active = false)
            item.active = true
            // 這裡可以添加切換到該時間點比較的邏輯
        }

        const handleResize = () => {
            showTimelineSidebar.value = window.innerWidth > 1200
        }

        const loadPageData = async () => {
            try {
                const pageId = route.params.id
                console.log('載入頁面數據:', pageId)
                // 這裡可以添加實際的API調用
            } catch (error) {
                console.error('載入頁面數據失敗:', error)
            }
        }

        // 生命周期
        onMounted(() => {
            loadPageData()
            window.addEventListener('resize', handleResize)
            handleResize()
        })

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize)
        })

        return {
            activeTimelineFilter,
            selectedOldVersion,
            selectedNewVersion,
            showTimelineSidebar,
            pageInfo,
            timelineFilters,
            availableVersions,
            changesSummary,
            oldVersionDate,
            newVersionDate,
            oldVersionContent,
            newVersionContent,
            timelineItems,
            setActiveTimelineFilter,
            getChangeBadgeClass,
            getChangeText,
            updateComparison,
            handleExportReport,
            selectTimelineItem
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

.content-detail-view {
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
    max-width: 1400px;
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

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
}

.page-info h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.page-info p {
    opacity: 0.9;
    font-size: 1.1rem;
}

.page-url {
    background: rgba(255,255,255,0.2);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: inline-block;
}

.page-stats {
    display: flex;
    gap: 2rem;
    text-align: center;
}

.stat-item {
    min-width: 80px;
}

.stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    display: block;
}

.stat-label {
    font-size: 0.8rem;
    opacity: 0.9;
    margin-top: 0.25rem;
}

.main-content {
    margin: 2rem auto;
}

.timeline-controls {
    background: white;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.timeline-filters {
    display: flex;
    gap: 0.5rem;
}

.filter-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.filter-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.export-btn {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
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

.export-btn:hover {
    transform: translateY(-2px);
}

.comparison-view {
    background: white;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    overflow: hidden;
}

.comparison-header {
    background: #f8fafc;
    padding: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.version-selector {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.version-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.version-label {
    font-size: 0.8rem;
    color: #666;
    font-weight: 600;
}

.version-select {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    cursor: pointer;
}

.changes-summary {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.summary-icon {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    color: white;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.added-icon { background: #22c55e; }
.modified-icon { background: #f59e0b; }
.removed-icon { background: #ef4444; }

.comparison-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.version-panel {
    padding: 2rem;
    border-right: 2px solid #e5e7eb;
}

.version-panel:last-child {
    border-right: none;
}

.version-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.version-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.version-old {
    background: #fee2e2;
    color: #dc2626;
}

.version-new {
    background: #dcfce7;
    color: #16a34a;
}

.version-date {
    color: #666;
    font-size: 0.9rem;
}

.content-section {
    margin-bottom: 2rem;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
}

.section-header h4 {
    font-size: 1.1rem;
    color: #374151;
}

.change-badge {
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
}

.badge-added {
    background: #dcfce7;
    color: #16a34a;
}

.badge-modified {
    background: #fef3c7;
    color: #d97706;
}

.badge-removed {
    background: #fee2e2;
    color: #dc2626;
}

.content-text {
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 1rem;
}

.content-list {
    padding-left: 1.5rem;
    color: #4b5563;
}

.content-list li {
    margin-bottom: 0.5rem;
}

:deep(.highlight-added) {
    background: linear-gradient(120deg, #dcfce7 0%, #dcfce7 100%);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
}

:deep(.highlight-removed) {
    background: linear-gradient(120deg, #fee2e2 0%, #fee2e2 100%);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    text-decoration: line-through;
    opacity: 0.7;
}

:deep(.highlight-modified) {
    background: linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
}

.timeline-sidebar {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    max-width: 250px;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 100;
}

.timeline-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
    text-align: center;
}

.timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background 0.2s ease;
}

.timeline-item:hover {
    background: #f8fafc;
}

.timeline-item.active {
    background: #ede9fe;
    border-left: 3px solid #667eea;
}

.timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: 0.25rem;
    flex-shrink: 0;
}

.dot-major {
    background: #667eea;
}

.dot-minor {
    background: #d1d5db;
}

.timeline-content {
    flex: 1;
}

.timeline-date {
    font-size: 0.7rem;
    color: #9ca3af;
    margin-bottom: 0.25rem;
}

.timeline-description {
    font-size: 0.75rem;
    color: #4b5563;
    line-height: 1.4;
}

@media (max-width: 1200px) {
    .timeline-sidebar {
        display: none;
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        gap: 1rem;
    }

    .page-stats {
        justify-content: center;
    }

    .timeline-controls {
        flex-direction: column;
        gap: 1rem;
    }

    .timeline-filters {
        flex-wrap: wrap;
        justify-content: center;
    }

    .comparison-content {
        grid-template-columns: 1fr;
    }

    .version-panel {
        border-right: none;
        border-bottom: 2px solid #e5e7eb;
    }

    .version-panel:last-child {
        border-bottom: none;
    }

    .version-selector {
        flex-direction: column;
        gap: 1rem;
    }

    .changes-summary {
        flex-direction: column;
        gap: 0.75rem;
    }
}
</style>