<script>
export default {
    name: 'AsideMenuContent',

    props: {
        title: String,
        searchWord: String
    },

    render() {
        const {title, searchWord} = this

        if (!searchWord) return <span>{title}</span>

        const start = title.indexOf(searchWord)

        if (start === -1) return <span>{title}</span>

        const end = start + searchWord.length

        return (
            <span>
                {title.substring(0, start)}
                <span class="menu-highlight-result">{title.substring(start, end)}</span>
                {title.substring(end)}
            </span>
        )
    }
}
</script>
