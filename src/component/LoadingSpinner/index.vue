<template v-once>
    <div class="el-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
    </div>
</template>

<script>
/**
 * 加载圈，用于侧边栏菜单、顶栏菜单的加载状态
 */

export default {
    name: 'LoadingSpinner'
}
</script>
