<img width="1440" height="1240" alt="image" src="https://github.com/user-attachments/assets/ac3d312a-4d5d-47cb-9b3d-bcd26840e305" />


perfume-platform/
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── main.py                 # App factory, middleware registration
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic Settings (env-driven)
│   │   │   ├── security.py         # JWT, password hashing
│   │   │   ├── rbac.py             # Permission registry + dependency
│   │   │   ├── database.py         # SQLAlchemy async engine
│   │   │   └── redis_client.py
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── router.py
│   │   │   │   ├── service.py
│   │   │   │   ├── models.py       # SQLAlchemy ORM models
│   │   │   │   ├── schemas.py      # Pydantic I/O schemas
│   │   │   │   └── repository.py
│   │   │   ├── users/
│   │   │   ├── cms/                # Company website content
│   │   │   ├── catalog/            # Products, segments
│   │   │   ├── builder/            # Custom builder configurations
│   │   │   ├── projects/           # Client projects + drafts
│   │   │   ├── workflow/           # Request lifecycle engine
│   │   │   ├── quotations/
│   │   │   ├── messaging/          # In-app comms
│   │   │   ├── notifications/
│   │   │   ├── files/              # S3 upload/download
│   │   │   └── analytics/
│   │   ├── workers/
│   │   │   ├── celery_app.py
│   │   │   ├── tasks/
│   │   │   │   ├── email.py
│   │   │   │   ├── pdf_generation.py
│   │   │   │   └── notifications.py
│   │   └── migrations/             # Alembic
├── frontend/                       # Next.js 14 App Router
│   ├── app/
│   │   ├── (public)/               # Route group: public site
│   │   │   ├── page.tsx            # Home
│   │   │   ├── about/
│   │   │   ├── capabilities/
│   │   │   ├── portfolio/
│   │   │   ├── catalog/
│   │   │   ├── contact/
│   │   │   └── request-quote/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (portal)/               # Client portal (auth-guarded)
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── builder/
│   │   │   │   ├── perfume/
│   │   │   │   └── cosmetics/
│   │   │   ├── messages/
│   │   │   └── documents/
│   │   └── (admin)/                # Admin panel (role-guarded)
│   │       ├── dashboard/
│   │       ├── users/
│   │       ├── submissions/
│   │       ├── workflow/
│   │       ├── pricing/
│   │       └── cms/
│   ├── components/
│   │   ├── builder/                # 3D preview, configurator panels
│   │   ├── portal/
│   │   ├── admin/
│   │   └── ui/                     # shadcn/ui primitives
│   ├── lib/
│   │   ├── api/                    # Typed API client (openapi-fetch)
│   │   ├── stores/                 # Zustand stores
│   │   └── hooks/
│   └── types/
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.worker
│   ├── docker-compose.yml          # Local dev
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   │   └── nginx.conf
│   └── k8s/                        # Kubernetes manifests (Phase 8)
│       ├── deployments/
│       ├── services/
│       └── ingress/
└── .github/
    └── workflows/
        ├── ci.yml
        └── cd.yml
