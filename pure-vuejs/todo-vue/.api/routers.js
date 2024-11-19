
// Imports
import * as _0_0 from "@api/root/src/rest-api/v1/file/index.ts";
import * as _0_1 from "@api/root/src/rest-api/v1/hello/index.ts";
import * as configure from "@api/configure";

export const routeBase = "/rest-api";

const internal  = [
  _0_0.default && {
        source     : "src/rest-api/v1/file/index.ts?fn=default",
        method     : "use",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.default,
      },
  _0_0.GET && {
        source     : "src/rest-api/v1/file/index.ts?fn=GET",
        method     : "get",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.GET,
      },
  _0_0.PUT && {
        source     : "src/rest-api/v1/file/index.ts?fn=PUT",
        method     : "put",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.PUT,
      },
  _0_0.POST && {
        source     : "src/rest-api/v1/file/index.ts?fn=POST",
        method     : "post",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.POST,
      },
  _0_0.PATCH && {
        source     : "src/rest-api/v1/file/index.ts?fn=PATCH",
        method     : "patch",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.PATCH,
      },
  _0_0.DELETE && {
        source     : "src/rest-api/v1/file/index.ts?fn=DELETE",
        method     : "delete",
        route      : "/v1/file/",
        path       : "/rest-api/v1/file/",
        url        : "/rest-api/v1/file/",
        cb         : _0_0.DELETE,
      },
  _0_1.default && {
        source     : "src/rest-api/v1/hello/index.ts?fn=default",
        method     : "use",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.default,
      },
  _0_1.GET && {
        source     : "src/rest-api/v1/hello/index.ts?fn=GET",
        method     : "get",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.GET,
      },
  _0_1.PUT && {
        source     : "src/rest-api/v1/hello/index.ts?fn=PUT",
        method     : "put",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.PUT,
      },
  _0_1.POST && {
        source     : "src/rest-api/v1/hello/index.ts?fn=POST",
        method     : "post",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.POST,
      },
  _0_1.PATCH && {
        source     : "src/rest-api/v1/hello/index.ts?fn=PATCH",
        method     : "patch",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.PATCH,
      },
  _0_1.DELETE && {
        source     : "src/rest-api/v1/hello/index.ts?fn=DELETE",
        method     : "delete",
        route      : "/v1/hello/",
        path       : "/rest-api/v1/hello/",
        url        : "/rest-api/v1/hello/",
        cb         : _0_1.DELETE,
      }
].filter(it => it);

export const routers = internal.map((it) => {
  const { method, path, route, url, source } = it;
  return { method, url, path, route, source };
});

export const endpoints = internal.map(
  (it) => it.method?.toUpperCase() + "\t" + it.url
);

export const applyRouters = (applyRouter) => {
  internal.forEach((it) => {
    it.cb = configure.callbackBefore?.(it.cb, it) || it.cb;
    applyRouter(it);
  });
};

