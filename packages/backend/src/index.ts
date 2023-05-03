import { errorMessageOf, Logger } from "./common";
import { startService, createServiceContext } from "./service";

startService(createServiceContext()).catch((error) => {
    Logger.error({
        message: errorMessageOf(error),
        callSite: { file: __filename },
        exitReason: `failed invoking ${startService.name} function`,
    });
});
