export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/images/palace-fine-arts.jpg","assets/pdf/CS182_Notes.pdf","assets/pdf/CS184_Notes.pdf","assets/pdf/CS285_Notes.pdf","assets/pdf/CoveringSpaces.pdf","assets/pdf/MatrixLieGroups.pdf","assets/pdf/tttmc.pdf"]),
	mimeTypes: {".jpg":"image/jpeg",".pdf":"application/pdf"},
	_: {
		client: {"start":"_app/immutable/entry/start.JvXSW-1n.js","app":"_app/immutable/entry/app.BWm0ytVt.js","imports":["_app/immutable/entry/start.JvXSW-1n.js","_app/immutable/chunks/entry.DiG3l9ZE.js","_app/immutable/chunks/scheduler.CLMbFzqk.js","_app/immutable/entry/app.BWm0ytVt.js","_app/immutable/chunks/scheduler.CLMbFzqk.js","_app/immutable/chunks/index.3azBk1-z.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
