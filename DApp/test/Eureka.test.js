const Eureka = artifacts.require('./Eureka.sol')

contract('Eureka', (accounts) =>
{
	let eureka 

	before(async () => {
		eureka = await Eureka.deployed()
	})

	describe('deployment', async () => {

		it('deploys sucessfully', async () => {

			const address = await eureka.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})
	})
	})


