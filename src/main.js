import { logger } from "./applications/logging.js";
import { web } from "./applications/web.js";

web.listen(5000, () => {
  logger.info('App start')
})