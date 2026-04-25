const SWAPS: Record<string, string> = {
  forty: 'fourty',
  fifty: 'fifity',
  twenty: 'tweny',
  thirty: 'thirdy',
  ninety: 'ninty',
  eleven: 'elevin',
  twelve: 'twleve',
  thirteen: 'thrteen',
}

export function applyGaslighting(input: string): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      // 40% chance of triggering a swap
      if (Math.random() > 0.40) {
        resolve(input)
        return
      }
      let result = input
      for (const [correct, wrong] of Object.entries(SWAPS)) {
        if (result.includes(correct)) {
          result = result.replace(correct, wrong)
          break
        }
      }
      resolve(result)
    }, 80)
  })
}
