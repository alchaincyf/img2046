'use client'

import React, { useState } from 'react'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, TextField, InputAdornment, Container } from '@mui/material'
import Link from 'next/link'
import SearchIcon from '@mui/icons-material/Search'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { blogPosts } from './blogData'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const categories = ['全部', ...Array.from(new Set(blogPosts.map(post => post.category)))]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* 标题区 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 'bold', mb: 2 }}>
          图像处理知识库
        </Typography>
        <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, color: 'text.secondary', mb: 4 }}>
          图片处理技巧、工具使用教程、SEO优化指南
        </Typography>

        {/* 搜索框 */}
        <TextField
          placeholder="搜索文章..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 600, mx: 'auto' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 分类标签 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? 'primary' : 'default'}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* 文章网格 */}
      <Grid container spacing={4}>
        {filteredPosts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.slug}>
            <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.coverImage}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={post.category} size="small" color="primary" />
                    {post.tags.slice(0, 2).map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {post.publishDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      阅读时间 {post.readTime}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* 无结果提示 */}
      {filteredPosts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            未找到匹配的文章
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            试试搜索其他关键词或切换分类
          </Typography>
        </Box>
      )}
    </Container>
  )
}
