CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "tenant_name" TEXT,
    "tenant_slug" TEXT,
    "actor_user_id" TEXT,
    "actor_tenant_id" TEXT,
    "actor_email" TEXT,
    "actor_role_code" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "previous_hash" TEXT,
    "event_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_events_tenant_id_created_at_idx" ON "audit_events"("tenant_id", "created_at");
CREATE INDEX "audit_events_action_created_at_idx" ON "audit_events"("action", "created_at");
CREATE INDEX "audit_events_resource_type_resource_id_idx" ON "audit_events"("resource_type", "resource_id");
CREATE INDEX "audit_events_actor_user_id_created_at_idx" ON "audit_events"("actor_user_id", "created_at");
