class TrigonometryCache {
    private readonly data: Map<number, number> = new Map()

    constructor(
        private readonly calculate: (v: number) => number
    ) {
    }

    get = (key: number) => {
        const value = this.data.get(key)
        if (value !== undefined) {
            return value
        }

        const calculated = this.calculate(key)
        this.data.set(key, calculated)
        return calculated
    }

    warmUp = (step: number)=> {
        for(let a = 0; a<=Math.PI * 2; a+=step) {
            this.get(a)
        }
    }
}

export const sinCache = new TrigonometryCache(Math.sin)
export const cosCache = new TrigonometryCache(Math.cos)