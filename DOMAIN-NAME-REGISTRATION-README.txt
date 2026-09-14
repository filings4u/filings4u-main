Domain Name Registration integration added
==========================================

Website changes
- Added domain-name-registration.html
- Added Domain Name Registration to Specialty Services navigation
- Added Domain Name Registration to Get Started > Design Services
- Added three pricing tiers to specialty-pricing.js and specialty-service-pricing.js
- Page uses the existing wizard-v2 handoff with service=domain-name-registration and requiresJurisdiction=false

Wizard integration
- wizard-integration/domain-name-registration-form.js contains the complete intake definition
- wizard-integration/domain-name-registration-supabase.sql contains the Supabase table/RLS migration

Important
- The supplied ZIP does not contain wizard.filings4u.com source code, so the form definition cannot be merged into wizard-v2.html from this archive alone.
- The database migration is intentionally not applied to the currently connected screenings4u/workforce Supabase account. Connect the filings4u Supabase project first.
- Registrar transfer authorization codes should not be stored in the general intake table; handle them through a protected server-side secret workflow.
