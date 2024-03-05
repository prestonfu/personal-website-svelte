export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["assets/images/palace-fine-arts.jpg","assets/pdf/CS182_Notes.pdf","assets/pdf/CS285_Notes.pdf","assets/pdf/CoveringSpaces.pdf","assets/pdf/MatrixLieGroups.pdf"]),
	mimeTypes: {".jpg":"image/jpeg",".pdf":"application/pdf"},
	_: {
		client: {"start":"_app/immutable/entry/start.DHVVEorM.js","app":"_app/immutable/entry/app.Dp8OTAd-.js","imports":["_app/immutable/entry/start.DHVVEorM.js","_app/immutable/chunks/entry.DY_P7giH.js","_app/immutable/chunks/scheduler.DncWI_c9.js","_app/immutable/entry/app.Dp8OTAd-.js","_app/immutable/chunks/scheduler.DncWI_c9.js","_app/immutable/chunks/index.zjPmmWb8.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
