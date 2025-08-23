// Compatibility shim to avoid mixed middlewares across the codebase.
// Always use the single source of truth from authMiddleware.
import { protect } from './authMiddleware.js';
export default protect;