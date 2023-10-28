import { logger } from "./src/applications/logging.js";
import { web } from "./src/applications/web.js";

web.listen(5000, () => {
  logger.info('App start')
})