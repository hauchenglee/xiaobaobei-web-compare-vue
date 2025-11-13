<template>
    <div class="home-view">
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <h1>政府網站變化監控系統</h1>
                    <p>即時追蹤臺灣各地政府網站政策變化</p>
                </div>
            </div>
        </header>

        <main class="container">
            <div class="stats-bar">
                <div class="stat-item">
                    <span class="stat-number">{{ globalStats.websites }}</span>
                    <div class="stat-label">監控網站</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ globalStats.pages }}</span>
                    <div class="stat-label">監控頁面</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ globalStats.todayChanges }}</span>
                    <div class="stat-label">今日變化</div>
                </div>
                <div class="stat-item">
                    <span class="stat-number">{{ formatNumber(globalStats.totalChanges) }}</span>
                    <div class="stat-label">總變化數</div>
                </div>
            </div>

            <div class="main-content">
                <div class="section-header">
                    <h2 class="section-title">監控網站</h2>
                    <button class="add-website-btn" @click="handleAddWebsite">
                        ➕ 新增網站
                    </button>
                </div>

                <div class="websites-grid">
                    <div
                        v-for="website in websites"
                        :key="website.id"
                        class="website-card"
                        @click="navigateToWebsite(website.id)"
                    >
                        <div class="website-header">
                            <div class="website-icon" :class="website.iconClass">{{ website.icon }}</div>
                            <div class="website-info">
                                <h3>{{ website.name }}</h3>
                                <p>{{ website.url }}</p>
                            </div>
                        </div>
                        <div class="website-stats">
                            <div class="stat-box">
                                <span class="stat-box-number changes-today">{{ website.stats.todayChanges }}</span>
                                <div class="stat-box-label">今日變化</div>
                            </div>
                            <div class="stat-box">
                                <span class="stat-box-number pages-monitored">{{ website.stats.monitoredPages }}</span>
                                <div class="stat-box-label">監控頁面</div>
                            </div>
                            <div class="stat-box">
                                <span class="stat-box-number total-changes">{{ website.stats.totalChanges }}</span>
                                <div class="stat-box-label">總變化</div>
                            </div>
                        </div>
                        <div class="recent-activity">
                            <h4>最近活動</h4>
                            <div
                                v-for="activity in website.recentActivities"
                                :key="activity.id"
                                class="activity-item"
                            >
                                <div class="activity-dot"></div>
                                <span class="activity-text">{{ activity.description }}</span>
                                <span class="activity-time">{{ activity.timeAgo }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="container">
                <p>&copy; 2024 政府網站變化監控系統 | 讓重要政策變化不再遺漏</p>
            </div>
        </footer>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
    name: 'HomeView',
    setup() {
        const router = useRouter()

        // 響應式數據
        const globalStats = reactive({
            websites: 12,
            pages: 87,
            todayChanges: 23,
            totalChanges: 1247
        })

        const websites = ref([
            {
                id: 1,
                name: '新北市政府',
                url: 'www.ntpc.gov.tw',
                icon: '新',
                iconClass: 'new-taipei-icon',
                stats: {
                    todayChanges: 5,
                    monitoredPages: 8,
                    totalChanges: 234
                },
                recentActivities: [
                    {
                        id: 1,
                        description: '身心障礙補助金額調整',
                        timeAgo: '2小時前'
                    },
                    {
                        id: 2,
                        description: '新增線上申請服務',
                        timeAgo: '5小時前'
                    }
                ]
            },
            {
                id: 2,
                name: '臺北市政府',
                url: 'www.gov.taipei',
                icon: '臺',
                iconClass: 'taipei-icon',
                stats: {
                    todayChanges: 3,
                    monitoredPages: 12,
                    totalChanges: 189
                },
                recentActivities: [
                    {
                        id: 1,
                        description: '敬老卡使用範圍擴大',
                        timeAgo: '1天前'
                    },
                    {
                        id: 2,
                        description: '青年創業貸款條件更新',
                        timeAgo: '2天前'
                    }
                ]
            },
            {
                id: 3,
                name: '臺中市政府',
                url: 'www.taichung.gov.tw',
                icon: '中',
                iconClass: 'taichung-icon',
                stats: {
                    todayChanges: 1,
                    monitoredPages: 6,
                    totalChanges: 156
                },
                recentActivities: [
                    {
                        id: 1,
                        description: '托育補助申請流程簡化',
                        timeAgo: '3天前'
                    },
                    {
                        id: 2,
                        description: '停車費率調整公告',
                        timeAgo: '5天前'
                    }
                ]
            }
        ])

        // 方法
        const formatNumber = (num) => {
            return num.toLocaleString()
        }

        const handleAddWebsite = () => {
            console.log('新增網站功能')
            // 這裡可以添加新增網站的邏輯
            alert('新增網站功能開發中...')
        }

        const navigateToWebsite = (websiteId) => {
            router.push(`/website/${websiteId}`)
        }

        const fetchData = async () => {
            try {
                // 模擬API調用
                console.log('載入數據...')
                // 這裡可以添加實際的API調用
            } catch (error) {
                console.error('載入數據失敗:', error)
            }
        }

        // 生命周期
        onMounted(() => {
            fetchData()
        })

        return {
            globalStats,
            websites,
            formatNumber,
            handleAddWebsite,
            navigateToWebsite
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

.home-view {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.header-content {
    text-align: center;
}

.header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.stats-bar {
    background: white;
    margin: 2rem auto;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
    display: block;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.25rem;
}

.main-content {
    margin: 2rem auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
}

.add-website-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.add-website-btn:hover {
    transform: translateY(-2px);
}

.websites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
}

.website-card {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.website-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
}

.website-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.website-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
}

.taipei-icon { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }
.new-taipei-icon { background: linear-gradient(135deg, #059669 0%, #10b981 100%); }
.taichung-icon { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); }

.website-info h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.website-info p {
    color: #666;
    font-size: 0.9rem;
}

.website-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-box {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
}

.stat-box-number {
    font-size: 1.5rem;
    font-weight: 700;
    display: block;
}

.stat-box-label {
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.25rem;
}

.changes-today {
    color: #059669;
}

.pages-monitored {
    color: #4f46e5;
}

.total-changes {
    color: #dc2626;
}

.recent-activity {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
}

.recent-activity h4 {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
}

.activity-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4f46e5;
}

.activity-text {
    flex: 1;
    color: #4b5563;
}

.activity-time {
    color: #9ca3af;
    font-size: 0.75rem;
}

.footer {
    background: #374151;
    color: white;
    padding: 2rem 0;
    margin-top: 4rem;
    text-align: center;
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }

    .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .websites-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
</style>