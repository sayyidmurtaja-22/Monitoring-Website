```mermaid
graph TD
    %% Tampilan Frontend / Klien
    subgraph Frontend [Frontend - Klien (Browser)]
        UI[UI Components<br/>Tailwind, Shadcn, Chakra]
        Charts[Data Visualization<br/>Recharts, Echarts]
        Animations[Animations<br/>Framer Motion, GSAP]
        
        UI --- Charts
        UI --- Animations
    end

    %% Tampilan Backend / Server
    subgraph Backend [Backend - Server (Next.js App Router)]
        NextAPI[API Routes & Server Actions]
        Auth[Autentikasi<br/>NextAuth.js]
        
        NextAPI --- Auth
    end

    %% Database dan ORM
    subgraph DatabaseLayer [Database Layer]
        Prisma[Prisma ORM]
        MySQL[(MySQL Database)]
        
        Prisma --> MySQL
    end

    %% Hubungan antar layer
    Frontend <-->|HTTP/REST / Server Actions| Backend
    Backend <-->|Queries / Mutations| Prisma

    %% Detail Database
    subgraph DataModels [Skema Database]
        Users[Tabel Users, Accounts, Sessions]
        AWS[Tabel AWS Bali, Pangandaran, Bungus]
    end

    MySQL --- DataModels

    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef db fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    class UI,Charts,Animations frontend;
    class NextAPI,Auth backend;
    class Prisma,MySQL,Users,AWS db;
```
