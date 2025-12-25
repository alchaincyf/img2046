'use client'

import React from 'react'
import { Box, Typography, Container, Chip, Divider, Paper } from '@mui/material'
import { notFound } from 'next/navigation'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Link from 'next/link'
import { blogPosts } from '../blogData'

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  // 相关文章推荐
  const relatedPosts = blogPosts
    .filter(p => p.slug !== post.slug && (
      p.category === post.category ||
      p.tags.some(tag => post.tags.includes(tag))
    ))
    .slice(0, 3)

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* 面包屑导航 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>首页</Link>
          {' / '}
          <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>知识库</Link>
          {' / '}
          <span>{post.category}</span>
        </Typography>
      </Box>

      {/* 文章标题 */}
      <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 'bold', mb: 2 }}>
        {post.title}
      </Typography>

      {/* 文章元信息 */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {post.publishDate}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            阅读时间 {post.readTime}
          </Typography>
        </Box>
        <Chip label={post.category} size="small" color="primary" />
      </Box>

      {/* 封面图 */}
      <Box
        component="img"
        src={post.coverImage}
        alt={post.title}
        sx={{
          width: '100%',
          height: 'auto',
          maxHeight: 400,
          objectFit: 'cover',
          borderRadius: 2,
          mb: 4
        }}
      />

      {/* 文章摘要 */}
      <Paper elevation={0} sx={{ bgcolor: 'grey.100', p: 3, mb: 4, borderLeft: 4, borderColor: 'primary.main' }}>
        <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.8 }}>
          {post.excerpt}
        </Typography>
      </Paper>

      {/* 文章内容 */}
      <Box
        sx={{
          '& h2': { mt: 4, mb: 2, fontSize: '1.75rem', fontWeight: 'bold' },
          '& h3': { mt: 3, mb: 1.5, fontSize: '1.5rem', fontWeight: 'bold' },
          '& p': { mb: 2, lineHeight: 1.8 },
          '& ul, & ol': { mb: 2, pl: 3 },
          '& li': { mb: 1 },
          '& code': { bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, fontFamily: 'monospace' },
          '& pre': { bgcolor: 'grey.100', p: 2, borderRadius: 1, overflow: 'auto', mb: 2 },
          '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
          '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Divider sx={{ my: 4 }} />

      {/* 标签 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          相关标签
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            相关文章推荐
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {relatedPosts.map(relatedPost => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {relatedPost.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {relatedPost.excerpt}
                  </Typography>
                </Paper>
              </Link>
            ))}
          </Box>
        </>
      )}
    </Container>
  )
}
