import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#080604',
          color: '#f7f1e8',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ambient gold glow layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'radial-gradient(circle at 18% 28%, rgba(240,208,128,0.22), transparent 45%), radial-gradient(circle at 82% 78%, rgba(201,169,110,0.16), transparent 50%), radial-gradient(circle at 50% 50%, rgba(138,111,58,0.10), transparent 70%)',
          }}
        />

        {/* inset gold frame */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            right: '32px',
            bottom: '32px',
            display: 'flex',
            borderRadius: '28px',
            border: '1px solid rgba(240,208,128,0.18)',
            boxShadow: 'inset 0 1px 0 rgba(240,208,128,0.08)',
          }}
        />

        {/* corner ornaments */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: '52px',
            display: 'flex',
            width: '40px',
            height: '40px',
            borderTop: '2px solid #c9a96e',
            borderLeft: '2px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '52px',
            right: '52px',
            display: 'flex',
            width: '40px',
            height: '40px',
            borderTop: '2px solid #c9a96e',
            borderRight: '2px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '52px',
            display: 'flex',
            width: '40px',
            height: '40px',
            borderBottom: '2px solid #c9a96e',
            borderLeft: '2px solid #c9a96e',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            right: '52px',
            display: 'flex',
            width: '40px',
            height: '40px',
            borderBottom: '2px solid #c9a96e',
            borderRight: '2px solid #c9a96e',
          }}
        />

        {/* main content stack */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '110px 110px 100px 110px',
          }}
        >
          {/* kicker row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '22px',
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color: '#c9a96e',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '64px',
                height: '1px',
                background: '#c9a96e',
              }}
            />
            <div style={{ display: 'flex' }}>The Ascension System</div>
          </div>

          {/* headline block */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '186px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                lineHeight: 0.92,
                backgroundImage:
                  'linear-gradient(135deg, #8a6f3a 0%, #c9a96e 25%, #f0d080 45%, #fffbe6 55%, #f0d080 70%, #c9a96e 85%, #8a6f3a 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              SOFTMAXX
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '38px',
                color: 'rgba(240,232,220,0.78)',
                lineHeight: 1.35,
                maxWidth: '900px',
                fontWeight: 400,
              }}
            >
              Level up your body. Every day. No excuses.
            </div>
          </div>

          {/* footer row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(240,232,220,0.55)',
              }}
            >
              softmaxx.org
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '14px 26px',
                borderRadius: '999px',
                border: '1px solid rgba(240,208,128,0.32)',
                background: 'rgba(240,208,128,0.08)',
                fontSize: '20px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#f0d080',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex' }}>Join the Waitlist</div>
              <div style={{ display: 'flex', fontSize: '24px' }}>→</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
