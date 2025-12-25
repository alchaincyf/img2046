'use client'

import React from 'react'
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Script from 'next/script'

interface FAQ {
  question: string
  answer: string
  keywords: string[]
}

interface FeatureFAQProps {
  title: string
  description?: string
  faqs: FAQ[]
}

export default function FeatureFAQ({ title, description, faqs }: FeatureFAQProps) {
  // 生成JSON-LD结构化数据
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      {/* FAQ 结构化数据 */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Container maxWidth="md" sx={{ mt: 8, mb: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 'bold', mb: 2 }}
          >
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {description}
            </Typography>
          )}
        </Box>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 1,
                borderRadius: 1,
                '&:first-of-type': { borderRadius: 1 },
                '&:last-of-type': { borderRadius: 1 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-${index}-content`}
                id={`faq-${index}-header`}
                sx={{ px: 3, py: 1.5 }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
                <Typography sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 更多问题提示 */}
        <Box sx={{ mt: 6, textAlign: 'center', p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
            还有其他问题？
          </Typography>
          <Typography variant="body2" color="text.secondary">
            欢迎通过GitHub或邮箱联系我们：alchaincyf@gmail.com
          </Typography>
        </Box>
      </Container>
    </>
  )
}
