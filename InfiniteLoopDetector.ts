module DebugUtil {
	export class InfiniteLoopDetector {
		private constructor() {

		}
		private static map: { [index: number]: { count: number, time: number } } = {};
		private static _id = 1;
		public static get id() {
			return this._id++ % Number.MAX_VALUE;
		}

		public static infiniteLoopDetector(id: number) {
			if (id in this.map) { // 非首次执行，此处可以优化，性能太低
				if ((Date.now() - this.map[id].time > 3000) && this.map[id].count > 10000) {
					delete this.map[id]
					throw new Error('Loop runing too long!')
				}
				this.map[id].count++;
			} else { // 首次运行，记录循环开始的时间。之所有把非首次运行的判断写在前面的if里是因为上面会执行更多次
				this.map[id] = { count: 0, time: Date.now() }
			}
		}

		private static wrap = function (codeStr: string) {
			// this is not a strong regex, but enough to use at the time
			return codeStr.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, (loopHead) => {
				const id = DebugUtil.InfiniteLoopDetector.id;
				return `DebugUtil.InfiniteLoopDetector.infiniteLoopDetector(${id});${loopHead}DebugUtil.InfiniteLoopDetector.infiniteLoopDetector(${id});`
			})
		}

		private static unwrap = function (codeStr: string) {
			return codeStr.replace(/DebugUtil.InfiniteLoopDetector.infiniteLoopDetector\([0-9]*?\);/g, '')
		}


		public static detect(code: string) {
			const codeStr = DebugUtil.InfiniteLoopDetector.wrap(code)
			// Can only wrap plain code string, no function or other things, or it will throw
			// There is also an `unwrap` method to restore the code to the previous shape
			try {
				eval(codeStr)
			} catch (e) {
				throw e;
			}
		}
	}
}
