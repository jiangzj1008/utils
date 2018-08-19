const log = console.log.bind(console)

// 1. Promise.prototype.then
// 2. Promise.prototype.catch
// 3. Promise.all

class GePromise {
	constructor(func) {
		this.state = 'init'
		this.success = null
		this.fail = null
		this.callBackArgs = ''

		this._init(func)
	}

	_init(func) {
		const resolve = this.resolve.bind(this)
		const reject = this.reject.bind(this)
		func(resolve, reject)
	}

	_op() {
	}

	then(success) {
		this.success = success || this._op
		if (this.state === 'done') {
			this.success(this.callBackArgs)
		}
		return this
	}

	catch(fail) {
		this.fail = fail || this._op
		if (this.state === 'fail') {
			this.fail(this.callBackArgs)
		}
		return this
	}

	resolve(args = '') {
		this.state = 'done'
		this.callBackArgs = args
		this.success && this.then(this.success)
	}

	reject(args = '') {
		this.state = 'fail'
		this.callBackArgs = args
		this.fail && this.catch(this.fail)
	}

	static all(arr) {
		const cls = this
		let error = null
		let result = []
		let len = arr.length
		const p = new cls((resolve, reject) => {
			arr.forEach((item, index) => {
				if (error) {
					return
				}
				item.then((res) => {
					result[index] = res
					len -= 1
					if (len === 0) {
						resolve(result)
					}
				})
			})
		})
		return p
	}
}


const test_1 = function () {
	const p = new GePromise((res, rej) => {
		log(1)
		setTimeout(() => {
			res(2)
		}, 1000)
	})

	log(3)

	p.then((res) => {
		log(res)
	})
}

const p1 = new GePromise((resolve, reject) => {
	setTimeout(() => {
		resolve(1)
	}, 1000)
})
const p2 = new GePromise((resolve, reject) => {
	setTimeout(() => {
		resolve(2)
	}, 2000)
})
const p3 = new GePromise((resolve, reject) => {
	setTimeout(() => {
		resolve(3)
	}, 3000)
})

const test_2 = function () {
	const arr = [p1, p2, p3]
	const p = GePromise.all(arr)
	p.then((res) => {
		log(res)
	})
}
test_2()
