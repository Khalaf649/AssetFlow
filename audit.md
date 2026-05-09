# AssetTrack Frontend → API Design Audit Report

> **Phase 2 — Full Audit**  
> Comparing `AssetTrack-Backend/design/Assettrack api design.md` against all API calls in `assetflow/`

---

## API Design Endpoints (complete inventory)

| #   | Method | Path                             | Client File                                                        |
| --- | ------ | -------------------------------- | ------------------------------------------------------------------ |
| 1   | POST   | `/auth/register`                 | `auth/api/auth-api.ts` ✅                                          |
| 2   | POST   | `/auth/login`                    | `auth/api/auth-api.ts` ✅                                          |
| 3   | GET    | `/users`                         | `users/api/users-api.ts` ✅                                        |
| 4   | GET    | `/users/{id}`                    | `users/api/users-api.ts` ✅                                        |
| 5   | PATCH  | `/users/{id}/role`               | `users/api/users-api.ts` ✅                                        |
| 6   | DELETE | `/users/{id}`                    | `users/api/users-api.ts` ✅                                        |
| 7   | GET    | `/assets`                        | `assets/api/assets-api.ts` ✅                                      |
| 8   | POST   | `/assets`                        | `assets/api/assets-api.ts` ✅                                      |
| 9   | GET    | `/assets/{id}`                   | `assets/api/assets-api.ts` ✅                                      |
| 10  | PUT    | `/assets/{id}`                   | `assets/api/assets-api.ts` ✅                                      |
| 11  | DELETE | `/assets/{id}`                   | `assets/api/assets-api.ts` ✅                                      |
| 12  | GET    | `/assets/spare-laptops`          | `assets/api/assets-api.ts` ✅                                      |
| 13  | POST   | `/assets/{id}/allocations`       | `assets/api/assets-api.ts` ✅                                      |
| 14  | DELETE | `/assets/{id}/allocations`       | `assets/api/assets-api.ts` ✅                                      |
| 15  | GET    | `/assets/{id}/allocations`       | `assets/api/assets-api.ts` ✅                                      |
| 16  | POST   | `/assets/{id}/condition-reports` | `condition-reports/api/condition-reports-api.ts` ✅                |
| 17  | GET    | `/condition-reports`             | `condition-reports/api/condition-reports-api.ts` ✅                |
| 18  | PATCH  | `/condition-reports/{id}`        | `condition-reports/api/condition-reports-api.ts` ✅                |
| 19  | GET    | `/assets/search`                 | `assets/api/assets-api.ts` ✅                                      |
| 20  | GET    | `/reports/dashboard`             | `dashboard/api/dashboard-api.ts` + `reports/api/reports-api.ts` ✅ |
| 21  | GET    | `/reports/usage`                 | `reports/api/reports-api.ts` ✅                                    |
| 22  | GET    | `/reports/warranty-expiry`       | `reports/api/reports-api.ts` ✅                                    |
| 23  | GET    | `/notifications`                 | `dashboard/api/dashboard-api.ts` ✅                                |
| 24  | PATCH  | `/notifications/{id}/read`       | `dashboard/api/dashboard-api.ts` ✅                                |
| 25  | GET    | `/notifications/preferences`     | ❌ MISSING                                                         |
| 26  | PUT    | `/notifications/preferences`     | ❌ MISSING                                                         |

---

## ❌ MISSING ENDPOINTS

| #   | Endpoint                                                           | Status           |
| --- | ------------------------------------------------------------------ | ---------------- |
| 1   | `[GET] /notifications/preferences` — not called anywhere in client | Missing entirely |
| 2   | `[PUT] /notifications/preferences` — not called anywhere in client | Missing entirely |

---

## ⚠️ WRONG IMPLEMENTATION

| #   | Endpoint                        | File                                                   | Issue                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `[*] all endpoints`             | `src/lib/api-client.ts:15`                             | **`error.details` field name mismatch**: API design returns `{ field, issue }` but client types and maps as `{ field, message }`. Every hook that reads `detail.message` will fail — the server sends `detail.issue`.                                                                                                                                   |
| 2   | `[POST] /auth/register`         | `auth/api/auth-api.ts:14-18`                           | **Response type missing fields**: `RegisterResponse` omits `role` and `createdAt` which are returned per the API design.                                                                                                                                                                                                                                |
| 3   | `[GET] /condition-reports/{id}` | `condition-reports/api/condition-reports-api.ts:40-47` | **Endpoint not in API design**: The client has a `fetchConditionReport(id)` calling `GET /condition-reports/{id}`, but no such single-report-by-ID endpoint exists in the design doc. This may be an implementation-only addition or a client-side assumption. Flagging for review — will leave as-is since it doesn't conflict with a design endpoint. |
| 4   | `[GET] /reports/usage`          | `reports/api/reports-api.ts:16`                        | **Response type field mismatch**: `UsageReport.topUsers` has field `allocations` but the API design returns `allocationsCount`.                                                                                                                                                                                                                         |

---

## 🔴 UNHANDLED ERRORS

| #   | File                                                               | Hook/Call                                        | Issue                                                                                                                             |
| --- | ------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `app/assets/hooks/useAssets.ts`, line ~10                          | `[GET] /assets`                                  | **No error handler**: `useQuery` has no `onError`, no toast, no error state displayed. 401/403/500 errors are silently swallowed. |
| 2   | `app/assets/hooks/useAsset.ts`, line ~9                            | `[GET] /assets/{id}`                             | **No error handler**: Same as above — no error feedback for 404/401/403/500.                                                      |
| 3   | `app/assets/hooks/useSpareLaptops.ts`, line ~9                     | `[GET] /assets/spare-laptops`                    | **No error handler**: Silent failure on all errors.                                                                               |
| 4   | `app/assets/hooks/useAssetSearch.ts`, line ~12                     | `[GET] /assets/search`                           | **No error handler**: Silent failure on all errors.                                                                               |
| 5   | `app/assets/hooks/useAssetAllocations.ts`, line ~9                 | `[GET] /assets/{id}/allocations`                 | **No error handler**: Silent failure on all errors.                                                                               |
| 6   | `app/users/hooks/useUsers.ts`, line ~10                            | `[GET] /users`                                   | **No error handler**: Silent failure on all errors.                                                                               |
| 7   | `app/users/hooks/useUser.ts`, line ~9                              | `[GET] /users/{id}`                              | **No error handler**: Silent failure on 404/401/403.                                                                              |
| 8   | `app/condition-reports/hooks/useConditionReports.ts`, line ~97     | `[GET] /condition-reports`                       | **No error handler**: Silent failure on all errors.                                                                               |
| 9   | `app/condition-reports/hooks/useConditionReports.ts`, line ~112    | `[GET] /condition-reports/{id}`                  | **No error handler**: Silent failure on 404/401/403.                                                                              |
| 10  | `app/condition-reports/hooks/useConditionReports.ts`, line ~128    | `[POST] /assets/{id}/condition-reports (submit)` | **No error handler**: `useMutation` has no `onError` — 422 validation errors and 401/403 are silently swallowed.                  |
| 11  | `app/condition-reports/hooks/useConditionReports.ts`, line ~140    | `[PATCH] /condition-reports/{id} (resolve)`      | **No error handler**: `useMutation` has no `onError` — 401/403/422 are silently swallowed.                                        |
| 12  | `app/dashboard/hooks/useDashboardHooks.ts`, line ~48               | `[GET] /reports/dashboard`                       | **No error handler**: Falls back to mock data when no token, but real errors are silently swallowed.                              |
| 13  | `app/dashboard/hooks/useDashboardHooks.ts`, line ~63               | `[GET] /notifications`                           | **No error handler**: Same mock fallback issue, real errors silently swallowed.                                                   |
| 14  | `app/dashboard/hooks/useMarkNotificationReadMutation.ts`, line ~10 | `[PATCH] /notifications/{id}/read`               | **No error handler**: `useMutation` has no `onError`. Failures are silently swallowed.                                            |
| 15  | `app/reports/hooks/useDashboardStats.ts`, line ~8                  | `[GET] /reports/dashboard`                       | **No error handler**: Silent failure on all errors.                                                                               |
| 16  | `app/reports/hooks/useUsageReport.ts`, line ~17                    | `[GET] /reports/usage`                           | **No error handler**: Silent failure on all errors.                                                                               |
| 17  | `app/reports/hooks/useWarrantyExpiry.ts`, line ~11                 | `[GET] /reports/warranty-expiry`                 | **No error handler**: Silent failure on all errors.                                                                               |

---

## 🟡 PARTIAL ERROR HANDLING

| #   | File                                             | Hook/Call                           | Issue                                                                                                                                                                         |
| --- | ------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `app/assets/hooks/useDeleteAsset.ts`             | `[DELETE] /assets/{id}`             | Catches `ApiError` and shows generic `error.message` via toast, but doesn't distinguish 401 (redirect to login), 403 (not authorized), 404 (not found) error codes.           |
| 2   | `app/users/hooks/useDeleteUser.ts`               | `[DELETE] /users/{id}`              | Handles `USER_HAS_ACTIVE_ALLOCATIONS` specifically, but doesn't handle 401/403/404 with appropriate actions (redirect/UI feedback). Falls through to generic `error.message`. |
| 3   | `app/assets/hooks/useAllocations.ts` (assign)    | `[POST] /assets/{id}/allocations`   | Handles `ASSET_ALREADY_ASSIGNED` but falls through to generic `error.message` for 401/403/404.                                                                                |
| 4   | `app/assets/hooks/useAllocations.ts` (return)    | `[DELETE] /assets/{id}/allocations` | Handles `NO_ACTIVE_ALLOCATION` but falls through to generic for 401/403.                                                                                                      |
| 5   | `app/auth/hooks/useLoginMutation.ts`             | `[POST] /auth/login`                | Handles `UNAUTHORIZED` and validation details, but doesn't handle network errors separately from HTTP errors.                                                                 |
| 6   | `app/auth/hooks/useRegisterMutation.ts`          | `[POST] /auth/register`             | Handles `EMAIL_CONFLICT` and validation details, but doesn't handle network errors separately.                                                                                |
| 7   | `app/users/hooks/useUpdateRole.ts`               | `[PATCH] /users/{id}/role`          | Handles `LAST_ADMIN_PROTECTION` and validation, but doesn't handle 401/403 specifically.                                                                                      |
| 8   | `app/assets/hooks/useAssetMutations.ts` (create) | `[POST] /assets`                    | Handles `SERIAL_NUMBER_CONFLICT` and validation, but doesn't handle 401/403 specifically.                                                                                     |
| 9   | `app/assets/hooks/useAssetMutations.ts` (update) | `[PUT] /assets/{id}`                | Same as create — missing 401/403 handling.                                                                                                                                    |

---

## ✅ CORRECTLY IMPLEMENTED

> **None of the endpoints are fully correct.** Every endpoint shares the `error.details` field name mismatch (`message` vs `issue`), and none of the `useQuery`-based hooks have any error handling. All mutation hooks lack 401 auto-logout and 403 feedback.

---

## Summary of Issues to Fix

1. **Critical**: `api-client.ts` error details uses `message` but API returns `issue` — fix the interface and all consumers.
2. **Missing endpoints**: Create API functions + hooks for `GET /notifications/preferences` and `PUT /notifications/preferences`.
3. **Response type fix**: `RegisterResponse` missing `role` and `createdAt`. `UsageReport.topUsers` uses `allocations` instead of `allocationsCount`.
4. **Global error handling**: Add a centralized `onError` callback to the `QueryClient` for `useQuery` errors (401→logout, 403→toast, 500→toast).
5. **Mutation error handling**: Add 401/403 handling to all existing mutation `onError` callbacks.
6. **Network error handling**: Distinguish network errors (`TypeError: Failed to fetch`) from API errors in all hooks.
