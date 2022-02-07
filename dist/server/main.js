"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var head = require("@vueuse/head");
var vue = require("vue");
var serverRenderer = require("@vue/server-renderer");
var vueRouter = require("vue-router");
var serverRenderer$1 = require("vue/server-renderer");
var vuex = require("vuex");
var runtimeDom = require("@vue/runtime-dom");
var axios = require("axios");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var axios__default = /* @__PURE__ */ _interopDefaultLegacy(axios);
const S = "/";
function withPrefix(string, prefix) {
  return string.startsWith(prefix) ? string : prefix + string;
}
function withoutPrefix(string, prefix) {
  return string.startsWith(prefix) ? string.slice(prefix.length) : string;
}
function withoutSuffix(string, suffix) {
  return string.endsWith(suffix) ? string.slice(0, -1 * suffix.length) : string + suffix;
}
function createUrl(urlLike) {
  if (urlLike instanceof URL) {
    return urlLike;
  }
  if (!(urlLike || "").includes("://")) {
    urlLike = "http://e.g" + withPrefix(urlLike, S);
  }
  return new URL(urlLike);
}
function getFullPath(url, routeBase) {
  url = typeof url === "string" ? createUrl(url) : url;
  let fullPath = withoutPrefix(url.href, url.origin);
  if (routeBase) {
    const parts = fullPath.split(S);
    if (parts[1] === routeBase.replace(/\//g, "")) {
      parts.splice(1, 1);
    }
    fullPath = parts.join(S);
  }
  return fullPath;
}
function findDependencies(modules, manifest) {
  const files = new Set();
  for (const id of modules || []) {
    for (const file of manifest[id] || []) {
      files.add(file);
    }
  }
  return [...files];
}
function renderPreloadLinks(files) {
  let link = "";
  for (const file of files || []) {
    if (file.endsWith(".js")) {
      link += `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith(".css")) {
      link += `<link rel="stylesheet" href="${file}">`;
    }
  }
  return link;
}
function defer() {
  const deferred = { status: "pending" };
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = (value) => {
      deferred.status = "resolved";
      return resolve(value);
    };
    deferred.reject = (error) => {
      deferred.status = "rejected";
      return reject(error);
    };
  });
  return deferred;
}
const isRedirect = ({ status = 0 }) => status >= 300 && status < 400;
function useSsrResponse() {
  const deferred = defer();
  let response = {};
  const writeResponse = (params) => {
    Object.assign(response, params);
    if (isRedirect(params)) {
      deferred.resolve("");
    }
  };
  return {
    deferred,
    response,
    writeResponse,
    isRedirect: () => isRedirect(response),
    redirect: (location, status = 302) => writeResponse({ headers: { location }, status })
  };
}
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}
function serializeState(state2) {
  try {
    return JSON.stringify(JSON.stringify(state2 || {})).replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
  } catch (error) {
    console.error("[SSR] On state serialization -", error, state2);
    return "{}";
  }
}
function addPagePropsGetterToRoutes(routes2) {
  routes2.forEach((staticRoute) => {
    const originalProps = staticRoute.props;
    staticRoute.props = (route) => {
      const resolvedProps = originalProps === true ? route.params : typeof originalProps === "function" ? originalProps(route) : originalProps;
      return __spreadValues(__spreadValues(__spreadValues({}, (route.meta.hmr || {}).value), route.meta.state || {}), resolvedProps || {});
    };
  });
}
vue.defineComponent({
  name: "ClientOnly",
  setup(_, { slots }) {
    const show = vue.ref(false);
    vue.onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
const CONTEXT_SYMBOL = Symbol();
function provideContext(app, context) {
  app.provide(CONTEXT_SYMBOL, context);
}
function useContext() {
  return vue.inject(CONTEXT_SYMBOL);
}
const viteSSR = function viteSSR2(App, { routes: routes2, base, routerOptions = {}, pageProps = { passToPage: true }, transformState = serializeState }, hook) {
  if (pageProps && pageProps.passToPage) {
    addPagePropsGetterToRoutes(routes2);
  }
  return function(_0) {
    return __async(this, arguments, function* (url, _a = {}) {
      var _b = _a, { manifest, preload = false } = _b, extra = __objRest(_b, ["manifest", "preload"]);
      const app = vue.createSSRApp(App);
      url = createUrl(url);
      const routeBase = base && withoutSuffix(base({ url }), "/");
      const router = vueRouter.createRouter(__spreadProps(__spreadValues({}, routerOptions), {
        history: vueRouter.createMemoryHistory(routeBase),
        routes: routes2
      }));
      const { deferred, response, writeResponse, redirect, isRedirect: isRedirect2 } = useSsrResponse();
      const context = __spreadValues({
        url,
        isClient: false,
        initialState: {},
        redirect,
        writeResponse
      }, extra);
      provideContext(app, context);
      const fullPath = getFullPath(url, routeBase);
      const { head: head$1 } = hook && (yield hook(__spreadValues({
        app,
        router,
        initialRoute: router.resolve(fullPath)
      }, context))) || {};
      app.use(router);
      router.push(fullPath);
      yield router.isReady();
      if (isRedirect2())
        return response;
      Object.assign(context.initialState || {}, (router.currentRoute.value.meta || {}).state || {});
      serverRenderer.renderToString(app, context).then(deferred.resolve).catch(deferred.reject);
      const body = yield deferred.promise;
      if (isRedirect2())
        return response;
      let { headTags = "", htmlAttrs = "", bodyAttrs = "" } = head$1 ? head.renderHeadToString(head$1) : {};
      const dependencies = manifest ? findDependencies(context.modules, manifest) : [];
      if (preload && dependencies.length > 0) {
        headTags += renderPreloadLinks(dependencies);
      }
      const initialState = yield transformState(context.initialState || {}, serializeState);
      return __spreadValues({
        html: `<!DOCTYPE html>
<html ${htmlAttrs}  lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script type="module" crossorigin src="/assets/index.31655a78.js"><\/script>
    <link rel="modulepreload" href="/assets/vendor.919e8e6d.js">
    <link rel="stylesheet" href="/assets/index.0fc0ad7a.css">
  ${headTags}
</head>
  <body ${bodyAttrs} >
    <div id="app" data-server-rendered="true">${body}</div>

<script>window.__INITIAL_STATE__=${initialState}<\/script>
    
  </body>
</html>
`,
        htmlAttrs,
        headTags,
        body,
        bodyAttrs,
        initialState,
        dependencies
      }, response);
    });
  };
};
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => Promise.resolve().then(function() {
      return Home;
    })
  },
  {
    path: "/products",
    name: "Products",
    component: () => Promise.resolve().then(function() {
      return Products;
    })
  },
  {
    path: "/product/:id",
    name: "Product",
    component: () => Promise.resolve().then(function() {
      return Product;
    })
  }
];
var App_vue_vue_type_style_index_0_lang = "";
const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    head.useHead({
      meta: [{ name: "og:site_name", content: "Vite SSR Example Project" }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = vue.resolveComponent("RouterLink");
      const _component_RouterView = vue.resolveComponent("RouterView");
      _push(`<!--[--><div id="navbar">`);
      _push(serverRenderer$1.ssrRenderComponent(_component_RouterLink, {
        class: "link",
        to: { name: "Home" }
      }, {
        default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              vue.createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer$1.ssrRenderComponent(_component_RouterLink, {
        class: "link",
        to: { name: "Products" }
      }, {
        default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Products`);
          } else {
            return [
              vue.createTextVNode("Products")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div id="app-body">`);
      _push(serverRenderer$1.ssrRenderComponent(_component_RouterView, null, {
        default: vue.withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer$1.ssrRenderSuspense(_push2, {
              default: () => {
                serverRenderer$1.ssrRenderVNode(_push2, vue.createVNode(vue.resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
              },
              _: 2
            });
          } else {
            return [
              (vue.openBlock(), vue.createBlock(vue.Suspense, null, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component)))
                ]),
                _: 2
              }, 1024))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/App.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const state = () => ({
  coins: 0
});
const mutations = {
  INCREMENT(state2) {
    state2.coins++;
  }
};
const actions = {
  increment({ commit }) {
    commit("INCREMENT");
  }
};
var user = {
  state,
  mutations,
  actions
};
var store = vuex.createStore({
  modules: {
    user
  }
});
const Options = {
  routes,
  pageProps: {
    passToPage: false
  }
};
var main = viteSSR(_sfc_main$4, Options, (params) => __async(this, null, function* () {
  const { app, initialState, isClient, router } = params;
  const head$1 = head.createHead();
  app.use(head$1);
  app.use(router);
  app.use(store);
  return {
    head: head$1
  };
}));
var Home_vue_vue_type_style_index_0_lang = "";
const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    head.useHead({
      title: "Home"
    });
    const store2 = vuex.useStore();
    const user2 = runtimeDom.computed(() => store2.state.user);
    console.log(user2.value);
    console.log(user2.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="text-center">Vite SSR Example Project</div><div>Coins: ${serverRenderer$1.ssrInterpolate(vue.unref(user2).coins)}</div><button>Increment</button><!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/Home.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Home = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$3
});
var Card_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
  __ssrInlineRender: true,
  props: {
    product: null
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = vue.resolveComponent("RouterLink");
      _push(serverRenderer$1.ssrRenderComponent(_component_RouterLink, vue.mergeProps({
        to: { name: "Product", params: { id: __props.product.id } },
        class: "card"
      }, _attrs), {
        default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="card-img" data-v-b84d0176${_scopeId}><img loading="lazy"${serverRenderer$1.ssrRenderAttr("src", __props.product.image)} alt="image of card" data-v-b84d0176${_scopeId}></div><div class="card-body" data-v-b84d0176${_scopeId}><h4 class="card-title text-center" data-v-b84d0176${_scopeId}>${serverRenderer$1.ssrInterpolate(__props.product.title)}</h4><small class="card-detail" data-v-b84d0176${_scopeId}>${serverRenderer$1.ssrInterpolate(__props.product.description)}</small><div class="card-price" data-v-b84d0176${_scopeId}>${serverRenderer$1.ssrInterpolate(__props.product.price)}$</div></div>`);
          } else {
            return [
              vue.createVNode("div", { class: "card-img" }, [
                vue.createVNode("img", {
                  loading: "lazy",
                  src: __props.product.image,
                  alt: "image of card"
                }, null, 8, ["src"])
              ]),
              vue.createVNode("div", { class: "card-body" }, [
                vue.createVNode("h4", { class: "card-title text-center" }, vue.toDisplayString(__props.product.title), 1),
                vue.createVNode("small", { class: "card-detail" }, vue.toDisplayString(__props.product.description), 1),
                vue.createVNode("div", { class: "card-price" }, vue.toDisplayString(__props.product.price) + "$", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Card.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Card = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-b84d0176"]]);
function useAsyncData(key, location, config) {
  return __async(this, null, function* () {
    const { isClient, initialState } = useContext();
    const responseValue = vue.ref(initialState[key] || null);
    const request = () => axios__default["default"].get(location, config == null ? void 0 : config.axiosConfig);
    const handler = (type) => __async(this, null, function* () {
      try {
        const { data } = yield request();
        responseValue.value = data;
        if (type === "server")
          initialState[key] = data;
      } catch (error) {
        throw error;
      }
    });
    const removeState = () => {
      if (isClient)
        initialState[key] = null;
    };
    vue.onUnmounted(removeState);
    vue.onDeactivated(removeState);
    if (!isClient) {
      yield handler("server");
    } else {
      if (initialState[key])
        responseValue.value = initialState[key];
      else {
        const fn = () => __async(this, null, function* () {
          return yield handler("client");
        });
        if (config == null ? void 0 : config.awaitSetup)
          yield fn();
        else
          vue.onMounted(fn);
      }
    }
    return responseValue;
  });
}
const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    return __async(this, null, function* () {
      let __temp, __restore;
      head.useHead({
        title: "Products"
      });
      const store2 = vuex.useStore();
      const user2 = runtimeDom.computed(() => store2.state.user);
      console.log(user2.value);
      console.log(user2.value);
      const productData = ([__temp, __restore] = vue.withAsyncContext(() => useAsyncData("productsData", "https://fakestoreapi.com/products/", {
        axiosConfig: {},
        awaitSetup: false
      })), __temp = yield __temp, __restore(), __temp);
      return (_ctx, _push, _parent, _attrs) => {
        _push(`<!--[--><div>Coins: ${serverRenderer$1.ssrInterpolate(vue.unref(user2).coins)}</div><button>Increment</button><div class="flex flex-row flex-wrap px-10 justify-center">`);
        if (vue.unref(productData)) {
          _push(`<!--[-->`);
          serverRenderer$1.ssrRenderList(vue.unref(productData), (product) => {
            _push(serverRenderer$1.ssrRenderComponent(Card, {
              key: product.id,
              product
            }, null, _parent));
          });
          _push(`<!--]-->`);
        } else {
          _push(`<h3>Loading...</h3>`);
        }
        _push(`</div><!--]-->`);
      };
    });
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/Products.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Products = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$1
});
const _sfc_main = /* @__PURE__ */ vue.defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      let __temp, __restore;
      const route = vueRouter.useRoute();
      const productData = ([__temp, __restore] = vue.withAsyncContext(() => useAsyncData(`product-${route.params.id || "data"}`, `https://fakestoreapi.com/products/${route.params.id}`)), __temp = yield __temp, __restore(), __temp);
      head.useHead({
        meta: [
          { name: "og:description", content: (_a = productData.value) == null ? void 0 : _a.description },
          { name: "og:image", content: (_b = productData.value) == null ? void 0 : _b.image },
          { name: "og:title", content: (_c = productData.value) == null ? void 0 : _c.title }
        ]
      });
      return (_ctx, _push, _parent, _attrs) => {
        _push(`<div${serverRenderer$1.ssrRenderAttrs(vue.mergeProps({ class: "flex flex-row flex-wrap px-10 justify-center" }, _attrs))}>`);
        if (vue.unref(productData)) {
          _push(serverRenderer$1.ssrRenderComponent(Card, {
            style: { "width": "100%" },
            key: vue.unref(productData).id,
            product: vue.unref(productData)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      };
    });
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/Product.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Product = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main
});
exports["default"] = main;
