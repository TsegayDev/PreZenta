import type { SlideLayout } from './types';
interface Design {
  html: string;
  css: string;
}
export const layoutDesigns: {
  layouts: Record<SlideLayout, Design>;
  baseCss: string;
  bgCss: string;
  themeVariables: Record<string, string>;
} = {
  layouts: {
    title: {
      html: `
        <div class="slide-title">
          <div class="title-background"></div>
          <div class="title-content">
            <h1 class="slide-title-main">{{title}}</h1>
            <h2 class="slide-title-subtitle">{{content}}</h2>
          </div>
          <div class="title-decoration"></div>
        </div>
      `,
      css: `
        .slide-title {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          text-align: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
          background: var(--background);
        }
        
        .title-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 70% 30%, rgba(var(--accent-rgb), 0.15) 0%, transparent 60%);
          z-index: 0;
        }
        
        .title-content {
          z-index: 2;
          max-width: 90%;
        }
        
        .slide-title-main {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 8vw, 5rem);
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1.2;
          text-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, var(--heading) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .slide-title-subtitle {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.5rem, 3vw, 2rem);
          max-width: 80%;
          opacity: 0.9;
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        
        .title-decoration {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          box-shadow: 0 -2px 10px rgba(var(--accent-rgb), 0.3);
        }
      `,
    },
    content: {
      html: `
        <div class="slide-content-layout">
          <div class="content-background"></div>
          <div class="content-header">
            <h2 class="slide-heading">{{title}}</h2>
            <div class="heading-decoration"></div>
          </div>
          <div class="content-body">{{content}}</div>
        </div>
      `,
      css: `
        .slide-content-layout {
          padding: 3rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .content-background {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 85% 15%, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%);
          z-index: 0;
        }
        
        .content-header {
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 0.75rem;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        .heading-decoration {
          height: 6px;
          width: 100px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 3px;
          box-shadow: 0 2px 5px rgba(var(--accent-rgb), 0.3);
        }
        
        .content-body {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          line-height: 1.7;
          flex-grow: 1;
          white-space: pre-wrap;
          position: relative;
          z-index: 1;
          background: rgba(var(--cardBackground-rgb), 0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
        }
      `,
    },
    'two-column': {
      html: `
        <div class="slide-column-layout">
          <div class="column-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="columns-container two-columns">{{columns}}</div>
        </div>
      `,
      css: `
        .slide-column-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .column-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 10% 20%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 90% 80%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-column-layout .main-header {
          text-align: center;
          margin-bottom: 2.5rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .slide-column-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .columns-container {
          display: flex;
          gap: 2rem;
          z-index: 1;
        }
        
        .columns-container.two-columns {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .columns-container .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.8rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .columns-container .column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'two-column-headed': {
      html: `
        <div class="slide-two-column-headed">
          <div class="column-background"></div>
          <h2 class="slide-heading">{{title}}</h2>
          <div class="columns">{{columns}}</div>
        </div>
      `,
      css: `
        .slide-two-column-headed {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .column-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 40%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 70% 60%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 2.5rem;
          text-align: center;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .columns {
          display: flex;
          flex: 1;
          gap: 2rem;
          z-index: 1;
        }
        
        .columns .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border-left: 5px solid var(--accent);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .columns .column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
        
        .column-title {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          margin-bottom: 1.2rem;
          font-weight: 600;
        }
        
        .column-content {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          line-height: 1.7;
          flex-grow: 1;
        }
      `,
    },
    'three-column': {
      html: `
        <div class="slide-column-layout">
          <div class="column-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="columns-container three-columns">{{columns}}</div>
        </div>
      `,
      css: `
        .slide-column-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .column-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 30%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 80% 70%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-column-layout .main-header {
          text-align: center;
          margin-bottom: 2rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .slide-column-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .columns-container {
          display: flex;
          gap: 1.5rem;
          z-index: 1;
        }
        
        .columns-container.three-columns {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .columns-container .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .columns-container .column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'three-column-headed': {
      html: `
        <div class="slide-three-column-headed">
          <div class="column-background"></div>
          <h2 class="slide-heading">{{title}}</h2>
          <div class="columns">{{columns}}</div>
        </div>
      `,
      css: `
        .slide-three-column-headed {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .column-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 30%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 80% 70%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .columns {
          display: flex;
          flex: 1;
          gap: 1.5rem;
          z-index: 1;
        }
        
        .columns .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border-left: 4px solid var(--accent);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        
        .columns .column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
        
        .column-title {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .column-content {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1rem, 1.8vw, 1.4rem);
          line-height: 1.6;
          flex-grow: 1;
        }
      `,
    },
    'four-column': {
      html: `
        <div class="slide-column-layout">
          <div class="column-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="columns-container four-columns">{{columns}}</div>
        </div>
      `,
      css: `
        .slide-column-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .column-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 15% 25%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 85% 75%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-column-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .slide-column-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .columns-container {
          display: flex;
          gap: 1.2rem;
          z-index: 1;
        }
        
        .columns-container.four-columns {
          grid-template-columns: repeat(4, 1fr);
        }
        
        .columns-container .column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        
        .columns-container .column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'image-right': {
      html: `
        <div class="slide-image-right">
          <div class="image-background"></div>
          <div class="text-content">
            <h2 class="slide-heading">{{title}}</h2>
            <div class="content">{{content}}</div>
          </div>
          <div class="image-container">
            <div class="image-frame">
              <img src="https://placehold.co/600x400.png" alt="Placeholder image" />
            </div>
          </div>
        </div>
      `,
      css: `
        .slide-image-right {
          display: flex;
          height: 100%;
          align-items: center;
          padding: 2.5rem;
          gap: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 85% 50%, rgba(var(--primary-rgb), 0.12) 0%, transparent 60%);
          z-index: 0;
        }
        
        .text-content {
          flex: 1;
          padding-right: 1.5rem;
          z-index: 1;
        }
        
        .image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .image-frame {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          position: relative;
        }
        
        .image-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .image-frame:hover::before {
          opacity: 1;
        }
        
        .image-frame:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .image-frame img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        
        .image-frame:hover img {
          transform: scale(1.05);
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 1.2rem;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
        }
        
        .content {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.1rem, 2.2vw, 1.6rem);
          line-height: 1.6;
          background: rgba(var(--cardBackground-rgb), 0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
        }
      `,
    },
    'image-left': {
      html: `
        <div class="slide-image-left">
          <div class="image-background"></div>
          <div class="text-content">
            <h2 class="slide-heading">{{title}}</h2>
            <div class="content">{{content}}</div>
          </div>
          <div class="image-container">
            <div class="image-frame">
              <img src="https://placehold.co/600x400.png" alt="Placeholder image" />
            </div>
          </div>
        </div>
      `,
      css: `
        .slide-image-left {
          display: flex;
          height: 100%;
          align-items: center;
          padding: 2.5rem;
          gap: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 15% 50%, rgba(var(--primary-rgb), 0.12) 0%, transparent 60%);
          z-index: 0;
        }
        
        .text-content {
          flex: 1;
          padding-left: 1.5rem;
          z-index: 1;
        }
        
        .image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        
        .image-frame {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          position: relative;
        }
        
        .image-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .image-frame:hover::before {
          opacity: 1;
        }
        
        .image-frame:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .image-frame img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        
        .image-frame:hover img {
          transform: scale(1.05);
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 1.2rem;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
        }
        
        .content {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.1rem, 2.2vw, 1.6rem);
          line-height: 1.6;
          background: rgba(var(--cardBackground-rgb), 0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
        }
      `,
    },
    'title-bullets': {
      html: `
        <div class="slide-title-bullets">
          <div class="bullet-background"></div>
          <div class="content-header">
            <h2 class="slide-heading">{{title}}</h2>
            <div class="heading-decoration"></div>
          </div>
          <ul class="bullet-list"></ul>
        </div>
      `,
      css: `
        .slide-title-bullets {
          padding: 3rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .bullet-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 30%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 80% 70%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .content-header {
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .heading-decoration {
          height: 8px;
          width: 200px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 3px;
          box-shadow: 0 2px 5px rgba(var(--accent-rgb), 0.3);
        }
        
        .bullet-list {
          list-style: none;
          padding: 0;
          flex-grow: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          z-index: 1;
          align-items: start;
          justify-content: center;
        }
        
        .bullet-item {
          font-family: var(--body-font);
          color: var(--text);
          display: flex;
          align-items: flex-start;
          font-size: clamp(1.8rem, 3vw, 2rem);
          line-height: 1.6;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          height: auto;
          position: relative;
          overflow: hidden;
        }
        .slide-title-bullets .columns-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          grid-auto-rows: auto;
          gap: 3rem;
          z-index: 1;
          padding-left: 15px;
          width: 100%;
        }
          .slide-title-bullets .columns-container .column {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        .slide-title-bullets .columns-container .column .bullet-item::after {
          content: '';
          position: absolute;
          top: 50px;
          left: 24px;
          width: 5px;
          height: 250px;
          background: linear-gradient(180deg, var(--primary), var(--accent));
        }
        
        .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    quote: {
      html: `
        <div class="slide-quote">
          <div class="quote-background"></div>
          <div class="quote-mark">"</div>
          <blockquote class="quote-text">{{content}}</blockquote>
          <div class="quote-attribution">- {{title}}</div>
        </div>
      `,
      css: `
        .slide-quote {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 3rem;
          text-align: center;
          position: relative;
          background: var(--background);
          overflow: hidden;
        }
        
        .quote-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%);
          z-index: 0;
        }
        
        .quote-mark {
          font-family: var(--headline-font);
          color: var(--accent);
          font-size: clamp(10rem, 20vw, 15rem);
          position: absolute;
          top: 5%;
          left: 5%;
          opacity: 0.07;
          line-height: 1;
          z-index: 1;
        }
        
        .quote-text {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-style: italic;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
          line-height: 1.4;
          max-width: 80%;
          font-weight: 300;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, var(--heading) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .quote-attribution {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          align-self: flex-end;
          margin-top: 1rem;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }
      `,
    },
    comparison: {
      html: `
        <div class="slide-comparison">
          <div class="comparison-background"></div>
          <div class="comparison-column">
            <div class="column-header">
              <h3 class="column-title">Option A</h3>
            </div>
            <ul class="comparison-list"></ul>
          </div>
          <div class="comparison-divider">
            <div class="divider-text">VS</div>
          </div>
          <div class="comparison-column">
            <div class="column-header">
              <h3 class="column-title">Option B</h3>
            </div>
            <ul class="comparison-list"></ul>
          </div>
        </div>
      `,
      css: `
        .slide-comparison {
          display: flex;
          height: 100%;
          align-items: stretch;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .comparison-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 40% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 60% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .comparison-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          z-index: 1;
          position: relative;
          overflow: hidden;
        }
        
        .comparison-column:first-child::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .comparison-column:last-child::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--accent), var(--primary));
        }
        
        .comparison-column:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
        
        .column-header {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid var(--accent);
        }
        
        .column-title {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          margin: 0;
          font-weight: 700;
          text-align: center;
        }
        
        .comparison-list {
          list-style: none;
          padding: 0;
          flex-grow: 1;
        }
        
        .comparison-item {
          font-family: var(--body-font);
          color: var(--text);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          font-size: clamp(1rem, 2vw, 1.5rem);
          line-height: 1.6;
          transition: transform 0.2s ease;
        }
        
        .comparison-item:hover {
          transform: translateX(5px);
        }
        
        .comparison-item::before {
          content: '✓';
          color: var(--primary);
          font-weight: bold;
          margin-right: 1rem;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          text-shadow: 0 0 5px rgba(var(--primary-rgb), 0.3);
        }
        
        .comparison-divider {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 80px;
          z-index: 2;
        }
        
        .divider-text {
          font-family: var(--headline-font);
          color: var(--accent);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: bold;
          background: var(--background);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 2px solid var(--accent);
        }
      `,
    },
    'image-gallery': {
      html: `
        <div class="slide-image-gallery">
          <div class="gallery-background"></div>
          <h2 class="slide-heading">{{title}}</h2>
          <div class="gallery-grid">
            <div class="gallery-item">
              <div class="gallery-image-frame">
                <img src="https://placehold.co/300x200.png" alt="Gallery image 1" />
              </div>
            </div>
            <div class="gallery-item">
              <div class="gallery-image-frame">
                <img src="https://placehold.co/300x200.png" alt="Gallery image 2" />
              </div>
            </div>
            <div class="gallery-item">
              <div class="gallery-image-frame">
                <img src="https://placehold.co/300x200.png" alt="Gallery image 3" />
              </div>
            </div>
            <div class="gallery-item">
              <div class="gallery-image-frame">
                <img src="https://placehold.co/300x200.png" alt="Gallery image 4" />
              </div>
            </div>
          </div>
        </div>
      `,
      css: `
        .slide-image-gallery {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .gallery-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 40%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 70% 60%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 2rem;
          flex-grow: 1;
          z-index: 1;
        }
        
        .gallery-item {
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          height: 100%;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          position: relative;
        }
        
        .gallery-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .gallery-image-frame {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 16px;
          position: relative;
        }
        
        .gallery-image-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .gallery-item:hover .gallery-image-frame::before {
          opacity: 1;
        }
        
        .gallery-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .gallery-item:hover .gallery-image-frame img {
          transform: scale(1.05);
        }
      `,
    },
    'team-photos': {
      html: `
        <div class="slide-team-photos">
          <div class="team-background"></div>
          <h2 class="slide-heading">{{title}}</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-photo">
                <img src="https://placehold.co/150x150.png" alt="Team member" />
              </div>
              <div class="member-info">
                <div class="member-name">John Doe</div>
                <div class="member-title">CEO</div>
              </div>
            </div>
            <div class="team-member">
              <div class="member-photo">
                <img src="https://placehold.co/150x150.png" alt="Team member" />
              </div>
              <div class="member-info">
                <div class="member-name">Jane Smith</div>
                <div class="member-title">CTO</div>
              </div>
            </div>
            <div class="team-member">
              <div class="member-photo">
                <img src="https://placehold.co/150x150.png" alt="Team member" />
              </div>
              <div class="member-info">
                <div class="member-name">Bob Johnson</div>
                <div class="member-title">Designer</div>
              </div>
            </div>
          </div>
        </div>
      `,
      css: `
        .slide-team-photos {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .team-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%);
          z-index: 0;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .team-grid {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-grow: 1;
          gap: 2rem;
          z-index: 1;
        }
        
        .team-member {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .team-member::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .team-member:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .member-photo {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1.5rem;
          border: 5px solid var(--accent);
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .member-photo:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .member-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        
        .member-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .member-name {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .member-title {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1rem, 2vw, 1.3rem);
          opacity: 0.8;
          font-weight: 500;
        }
      `,
    },
    'data-chart': {
      html: `
        <div class="slide-data-chart">
          <div class="chart-background"></div>
          <div class="chart-header">
            <h2 class="slide-heading">{{title}}</h2>
            <div class="chart-subtitle">{{content}}</div>
          </div>
          <div class="chart-container">
            <div class="chart-placeholder">Chart will be rendered here</div>
          </div>
        </div>
      `,
      css: `
        .slide-data-chart {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 2.5rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .chart-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 40% 60%, rgba(var(--primary-rgb), 0.08) 0%, transparent 50%), 
                            radial-gradient(circle at 60% 40%, rgba(var(--accent-rgb), 0.08) 0%, transparent 50%);
          z-index: 0;
        }
        
        .chart-header {
          margin-bottom: 2rem;
          text-align: center;
          z-index: 1;
        }
        
        .slide-heading {
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          margin-bottom: 0.8rem;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        .slide-heading::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 10%;
          width: 80%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .chart-subtitle {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          opacity: 0.8;
          font-weight: 400;
        }
        
        .chart-container {
          flex-grow: 1;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          position: relative;
          overflow: hidden;
        }
        
        .chart-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .chart-placeholder {
          font-family: var(--body-font);
          color: var(--text);
          font-size: clamp(1rem, 2vw, 1.5rem);
          opacity: 0.7;
        }
      `,
    },
    timeline: {
      html: '',
      css: '',
    },
    'process-flow': {
      html: '',
      css: '',
    },
    'section-header': {
      html: '',
      css: '',
    },
    'title-bullets-image': {
      html: '',
      css: '',
    },
    blank: {
      html: '',
      css: '',
    },
    code: {
      html: '',
      css: '',
    },
    'accent-left': {
      html: `
        <div class="accent-left-layout">
          <div class="accent-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-left-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-left-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 5rem 7rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 10% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        .accent-left-layout .main-header {
          text-align: center;
          margin-bottom: 5rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-left-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-left-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          grid-auto-rows: auto;
          gap: 3rem;
          z-index: 1;
          padding-left: 35px;
          width: 100%;
        }
        
        .accent-left-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-left-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(180deg, var(--primary), var(--accent));
          border-radius: 2px 0 0 2px;
        }
        
        .accent-left-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'accent-right': {
      html: `
        <div class="accent-right-layout">
          <div class="accent-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-right-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-right-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 5rem 7rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 90% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
       
        .accent-right-layout .main-header {
          text-align: center;
          margin-bottom: 5rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-right-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-right-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
          grid-auto-rows: auto;
          gap: 3rem;
          z-index: 1;
          padding-right: 35px;
          width: 100%;
        }
        
        .accent-right-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-right-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(180deg, var(--primary), var(--accent));
          border-radius: 0 2px 2px 0;
        }
        
        .accent-right-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'accent-top': {
      html: `
        <div class="accent-top-layout">
          <div class="accent-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-top-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-top-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 5rem 7rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 50% 10%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .accent-top-layout .main-header {
          text-align: center;
          margin-bottom: 5rem;
          margin-top: 1.5rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-top-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-top-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(650px, 1fr));
          grid-auto-rows: auto;
          gap: 3rem;
          z-index: 1;
          width: 100%;
        }
        
        .accent-top-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-top-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px 2px 0 0;
        }
        
        .accent-top-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'accent-right-fit': {
      html: `
        <div class="accent-right-fit-layout">
          <div class="accent-background"></div>
          <div class="accent-right-fit"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-right-fit-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-right-fit-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 90% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .accent-right-fit {
          position: absolute;
          top: 25%;
          right: 5px;
          width: 10px;
          height: 50%;
          background: linear-gradient(180deg, transparent, var(--accent), transparent);
          border-radius: 2px;
          box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.5);
        }
        
        .accent-right-fit-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-right-fit-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-right-fit-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(650px, 1fr));
          grid-auto-rows: auto;
          gap: 1.2rem;
          z-index: 1;
          padding-right: 35px;
          width: 100%;
        }
        
        .accent-right-fit-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-right-fit-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(180deg, var(--primary), var(--accent));
          border-radius: 0 2px 2px 0;
        }
        
        .accent-right-fit-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'accent-left-fit': {
      html: `
        <div class="accent-left-fit-layout">
          <div class="accent-background"></div>
          <div class="accent-left-fit"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-left-fit-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-left-fit-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 10% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .accent-left-fit {
          position: absolute;
          top: 25%;
          left: 5px;
          width: 10px;
          height: 50%;
          background: linear-gradient(180deg, transparent, var(--accent), transparent);
          border-radius: 2px;
          box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.5);
        }
        
        .accent-left-fit-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-left-fit-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-left-fit-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(650px, 1fr));
          grid-auto-rows: auto;
          gap: 1.2rem;
          z-index: 1;
          padding-left: 35px;
          width: 100%;
        }
        
        .accent-left-fit-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          border: 1px solid var(--cardBorder);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-left-fit-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(180deg, var(--primary), var(--accent));
          border-radius: 2px 0 0 2px;
        }
        
        .accent-left-fit-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'accent-background': {
      html: `
        <div class="accent-background-layout">
          <div class="accent-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="accent-background-bullets-container">{{columns}}</div>
        </div>
      `,
      css: `
        .accent-background-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 7rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .accent-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent) 0%, rgba(255,255,255,0) 70%);
          opacity: 0.2;
          z-index: 0;
        }
        
        .accent-background-layout .main-header {
          text-align: center;
          margin-bottom: 5rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .accent-background-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .accent-background-bullets-container .bullet-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(650px, 1fr));
          grid-auto-rows: auto;
          gap: 3rem;
          z-index: 1;
          width: 100%;
        }
        
        .accent-background-bullets-container .bullet-list .bullet-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .accent-background-bullets-container .bullet-list .bullet-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px 2px 0 0;
        }
        
        .accent-background-bullets-container .bullet-list .bullet-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px var(--cardShadow);
        }
      `,
    },
    'two-image-columns': {
      html: `
        <div class="two-image-columns-layout">
          <div class="image-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="images-container">{{columns}}</div>
        </div>
      `,
      css: `
        .two-image-columns-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .two-image-columns-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .two-image-columns-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .two-image-columns-layout .images-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          width: 100%;
          z-index: 1;
        }
        
        .two-image-columns-layout .image-item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 0;
          padding-bottom: 75%; /* 4:3 Aspect Ratio */
        }
        
        .two-image-columns-layout .image-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 1;
        }
        
        .two-image-columns-layout .image-item img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .two-image-columns-layout .image-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .two-image-columns-layout .image-item:hover img {
          transform: scale(1.05);
        }
      `,
    },
    'three-image-columns': {
      html: `
        <div class="three-image-columns-layout">
          <div class="image-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="images-container">{{columns}}</div>
        </div>
      `,
      css: `
        .three-image-columns-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .three-image-columns-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .three-image-columns-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .three-image-columns-layout .images-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
          z-index: 1;
        }
        
        .three-image-columns-layout .image-item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 0;
          padding-bottom: 75%; /* 4:3 Aspect Ratio */
        }
        
        .three-image-columns-layout .image-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 1;
        }
        
        .three-image-columns-layout .image-item img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .three-image-columns-layout .image-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .three-image-columns-layout .image-item:hover img {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .three-image-columns-layout .images-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .three-image-columns-layout .images-container {
            grid-template-columns: 1fr;
          }
        }
      `,
    },
    'four-image-columns': {
      html: `
        <div class="four-image-columns-layout">
          <div class="image-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="images-container">{{columns}}</div>
        </div>
      `,
      css: `
        .four-image-columns-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .four-image-columns-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .four-image-columns-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .four-image-columns-layout .images-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          width: 100%;
          z-index: 1;
        }
        
        .four-image-columns-layout .image-item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 0;
          padding-bottom: 75%; /* 4:3 Aspect Ratio */
        }
        
        .four-image-columns-layout .image-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 1;
        }
        
        .four-image-columns-layout .image-item img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .four-image-columns-layout .image-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .four-image-columns-layout .image-item:hover img {
          transform: scale(1.05);
        }
        
        
      `,
    },
    'images-with-text': {
      html: `
        <div class="images-with-text-layout">
          <div class="image-background"></div>
          <div class="main-header">{{title}}</div>
          <div class="images-container">{{columns}}</div>
        </div>
      `,
      css: `
        .images-with-text-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.8rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .image-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 60%);
          z-index: 0;
        }
        
        .images-with-text-layout .main-header {
          text-align: center;
          margin-bottom: 1.8rem;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: clamp(3rem, 4vw, 3rem);
          font-weight: 700;
          position: relative;
          display: inline-block;
          align-self: center;
          z-index: 1;
        }
        
        .images-with-text-layout .main-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 25%;
          width: 50%;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          border-radius: 2px;
        }
        
        .images-with-text-layout .images-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          width: 100%;
          z-index: 1;
        }
        
        .images-with-text-layout .image-text-item {
          display: flex;
          flex-direction: column;
          background: var(--cardBackground);
          border: 1px solid var(--cardBorder);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 20px var(--cardShadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          position: relative;
        }
        
        .images-with-text-layout .image-text-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          z-index: 1;
        }
        
        .images-with-text-layout .image-text-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px var(--cardShadow);
        }
        
        .images-with-text-layout .image-wrapper {
          position: relative;
          overflow: hidden;
          height: 0;
          padding-bottom: 60%; /* 5:3 Aspect Ratio */
        }
        
        .images-with-text-layout .image-wrapper img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .images-with-text-layout .image-text-item:hover .image-wrapper img {
          transform: scale(1.05);
        }
        
        .images-with-text-layout .text-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .images-with-text-layout .text-content h3 {
          margin: 0 0 0.8rem 0;
          font-family: var(--headline-font);
          color: var(--heading);
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .images-with-text-layout .text-content p {
          margin: 0;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.6;
          flex-grow: 1;
        }
        
        .images-with-text-layout .text-content .read-more {
          margin-top: 1rem;
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s ease;
        }
        
        .images-with-text-layout .text-content .read-more:hover {
          transform: translateX(5px);
        }
        
        .images-with-text-layout .text-content .read-more::after {
          content: '→';
          margin-left: 5px;
          transition: transform 0.2s ease;
        }
        
        .images-with-text-layout .text-content .read-more:hover::after {
          transform: translateX(3px);
        }
      `,
    },
  },
  baseCss: `
    .slide-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-color: var(--background);
      color: var(--text);
      font-family: var(--body-font);
      box-sizing: border-box;
    }
    
    .slide-column-layout .main-header:empty {
      display: none;
    }
    
    .columns-container .column .column-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--accent);
    }
    
    .columns-container .column .column-title {
      font-family: var(--headline-font);
      color: var(--heading);
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      font-weight: 600;
      margin: 0;
    }
    
    .columns-container .column .bullet-list {
      list-style: none;
      padding: 0;
      margin: 0;
      flex-grow: 1;
    }
    
    .columns-container .column .bullet-item {
      font-family: var(--body-font);
      color: var(--text);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      font-size: clamp(2rem, 3vw, 2rem);
      line-height: 1.5;
      transition: transform 0.2s ease;
    }
    
    .columns-container .column .bullet-item::before {
      content: '•';
      color: var(--accent);
      font-weight: bold;
      margin-right: 1rem;
      font-size: clamp(1.7rem, 3vw, 2.3rem);
      line-height: 1;
      text-shadow: 0 0 5px rgba(var(--accent-rgb), 0.3);
    }
    
    .slide-title-bullets .columns-container {
      padding-top: 1.5rem;
    }
    
    .bullet-list.single-item {
      max-width: 80%;
      margin: 0 auto;
    }
  `,
  bgCss: `
    .slide-bg-only > * {
      display: none !important;
    }
    .slide-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      background-color: var(--background);
      color: var(--text);
      font-family: var(--body-font);
      box-sizing: border-box;
    }
  `,
  themeVariables: {
    '--background': 'background-color: {background};',
    '--cardBackground': 'background-color: {cardBackground};',
    '--cardBackground-rgb': '{cardBackgroundRgb};',
    '--cardBorder': 'border-color: {cardBorder};',
    '--cardShadow': 'box-shadow: {cardShadow};',
    '--text': 'color: {text};',
    '--heading': 'color: {heading};',
    '--primary': 'color: {primary};',
    '--accent': 'color: {accent};',
    '--primary-light': 'color: {primaryLight};',
    '--accent-light': 'color: {accentLight};',
    '--primary-rgb': '{primaryRgb};',
    '--accent-rgb': '{accentRgb};',
    '--headline-font': 'font-family: {headlineFont};',
    '--body-font': 'font-family: {bodyFont};',
    '--border-radius': 'border-radius: {borderRadius};',
    '--shadow': 'box-shadow: {shadow};',
    '--spacing': 'padding: {spacing};',
  },
};