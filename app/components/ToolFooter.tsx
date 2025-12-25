'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import FeatureFAQ from './FeatureFAQ';
import { getRelatedTools, getToolFaqData, toolCatalog } from './toolFooterData';

export default function ToolFooter() {
  const pathname = usePathname();
  const currentTool = toolCatalog.find((tool) => tool.href === pathname);

  if (!currentTool) {
    return null;
  }

  const faqData = getToolFaqData(currentTool);
  const relatedTools = getRelatedTools(currentTool, toolCatalog, 3);

  return (
    <>
      <FeatureFAQ
        title={faqData.title}
        description={faqData.description}
        faqs={faqData.faqs}
      />
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 'bold', mb: 2 }}
          >
            相关功能推荐
          </Typography>
          <Typography variant="body1" color="text.secondary">
            继续体验更多工具，提高效率与创作自由度。
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {relatedTools.map((tool) => (
            <Grid item xs={12} md={4} key={tool.href}>
              <Link href={tool.href} style={{ textDecoration: 'none' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Image src={tool.icon} alt={tool.name} width={36} height={36} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {tool.name}
                      </Typography>
                      <Chip label={tool.category} size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
