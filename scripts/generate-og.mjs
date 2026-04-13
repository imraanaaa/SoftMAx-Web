import { ImageResponse } from '@vercel/og'
import { writeFileSync } from 'node:fs'

const image = new ImageResponse(
  {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        background: '#080604',
        color: '#f7f1e8',
        position: 'relative',
        fontFamily: 'sans-serif',
      },
      children: [
        // ambient gold glow
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              background:
                'radial-gradient(circle at 18% 28%, rgba(240,208,128,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(201,169,110,0.16), transparent 50%), radial-gradient(circle at 50% 50%, rgba(138,111,58,0.10), transparent 70%)',
            },
          },
        },
        // inset gold frame
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '32px',
              left: '32px',
              right: '32px',
              bottom: '32px',
              display: 'flex',
              borderRadius: '28px',
              border: '1px solid rgba(240,208,128,0.18)',
            },
          },
        },
        // corner ornaments
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '52px',
              left: '52px',
              display: 'flex',
              width: '40px',
              height: '40px',
              borderTop: '2px solid #c9a96e',
              borderLeft: '2px solid #c9a96e',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '52px',
              right: '52px',
              display: 'flex',
              width: '40px',
              height: '40px',
              borderTop: '2px solid #c9a96e',
              borderRight: '2px solid #c9a96e',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '52px',
              left: '52px',
              display: 'flex',
              width: '40px',
              height: '40px',
              borderBottom: '2px solid #c9a96e',
              borderLeft: '2px solid #c9a96e',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '52px',
              right: '52px',
              display: 'flex',
              width: '40px',
              height: '40px',
              borderBottom: '2px solid #c9a96e',
              borderRight: '2px solid #c9a96e',
            },
          },
        },
        // main content
        {
          type: 'div',
          props: {
            style: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              padding: '110px',
            },
            children: [
              // kicker
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    fontSize: '22px',
                    letterSpacing: '0.36em',
                    textTransform: 'uppercase',
                    color: '#c9a96e',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          width: '64px',
                          height: '1px',
                          background: '#c9a96e',
                        },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex' },
                        children: 'The Ascension System',
                      },
                    },
                  ],
                },
              },
              // headline block
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '172px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          lineHeight: 0.92,
                          color: '#f0d080',
                        },
                        children: 'SOFTMAXX',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '36px',
                          color: 'rgba(240,232,220,0.78)',
                          lineHeight: 1.35,
                        },
                        children:
                          'Level up your body. Every day. No excuses.',
                      },
                    },
                  ],
                },
              },
              // footer
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '22px',
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: 'rgba(240,232,220,0.50)',
                        },
                        children: 'softmaxx.org',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 28px',
                          borderRadius: '999px',
                          border: '1px solid rgba(240,208,128,0.30)',
                          background: 'rgba(240,208,128,0.08)',
                          fontSize: '20px',
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: '#f0d080',
                          fontWeight: 600,
                        },
                        children: 'Join the Waitlist  →',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  { width: 1200, height: 630 },
)

const buffer = Buffer.from(await image.arrayBuffer())
writeFileSync('public/og-cover.png', buffer)
console.log('Created public/og-cover.png (%d KB)', Math.round(buffer.length / 1024))
