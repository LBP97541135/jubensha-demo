/**
 * AI Murder Game - API Constants
 */

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * 开发 mock 开关（显式启用）
 *
 * - true: 启用本地默认/假数据（开发演示用）
 * - false（默认）: 生产路径，只展示后端真实数据，UI 空状态用于无数据场景
 *
 * 通过环境变量 DEV_MOCK=true 显式开启，避免用户生产路径默认看到假数据。
 */
export const DEV_MOCK: boolean = String(import.meta.env.VITE_DEV_MOCK ?? "").toLowerCase() === "true";
