import { configure, renderFile } from "../deps.js";

const render = async (context, next) => {
  configure({
    views: `${Deno.cwd()}/views/`,
  });
  
  context.render = async (file, data) => {
    if (!data) {
      data = {};
    }

    if (await context.state.session.has("user")) {
      data.user = await context.state.session.get("user");
    }

    context.response.headers.set("Content-Type", "text/html; charset=utf-8");
    context.response.body = await renderFile(file, data);
  };

  await next();
};

export default render;