import { errorMessageOf, Logger } from "./common";
import { startService, createServiceContext } from "./service";

startService(createServiceContext()).catch((error: unknown) => {
    Logger.error({
        message: errorMessageOf(error),
        exitReason: `failed invoking ${startService.name} function`,
        error,
    });
});
