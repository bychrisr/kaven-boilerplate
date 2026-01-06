import nextra from 'nextra'

const withNextra = nextra({
})

export default withNextra({
    transpilePackages: ['lucide-react'],
    reactStrictMode: true,
})
