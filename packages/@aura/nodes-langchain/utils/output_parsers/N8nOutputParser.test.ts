import { mock } from 'jest-mock-extended';
import type { IExecuteFunctions } from 'aura-workflow';
import { NodeConnectionTypes } from 'aura-workflow';

import { getOptionalOutputParser } from './auraOutputParser';
import type { auraStructuredOutputParser } from './auraStructuredOutputParser';

describe('getOptionalOutputParser', () => {
	let mockContext: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		mockContext = mock<IExecuteFunctions>();
		jest.clearAllMocks();
	});

	it('should return undefined when hasOutputParser is false', async () => {
		mockContext.getNodeParameter.mockReturnValue(false);

		const result = await getOptionalOutputParser(mockContext);

		expect(result).toBeUndefined();
		expect(mockContext.getNodeParameter).toHaveBeenCalledWith('hasOutputParser', 0, true);
		expect(mockContext.getInputConnectionData).not.toHaveBeenCalled();
	});

	it('should return output parser when hasOutputParser is true with default index', async () => {
		const mockParser = mock<auraStructuredOutputParser>();
		mockContext.getNodeParameter.mockReturnValue(true);
		mockContext.getInputConnectionData.mockResolvedValue(mockParser);

		const result = await getOptionalOutputParser(mockContext);

		expect(result).toBe(mockParser);
		expect(mockContext.getNodeParameter).toHaveBeenCalledWith('hasOutputParser', 0, true);
		expect(mockContext.getInputConnectionData).toHaveBeenCalledWith(
			NodeConnectionTypes.AiOutputParser,
			0,
		);
	});

	it('should use provided index when fetching output parser', async () => {
		const mockParser = mock<auraStructuredOutputParser>();
		mockContext.getNodeParameter.mockReturnValue(true);
		mockContext.getInputConnectionData.mockResolvedValue(mockParser);

		const result = await getOptionalOutputParser(mockContext, 2);

		expect(result).toBe(mockParser);
		expect(mockContext.getNodeParameter).toHaveBeenCalledWith('hasOutputParser', 0, true);
		expect(mockContext.getInputConnectionData).toHaveBeenCalledWith(
			NodeConnectionTypes.AiOutputParser,
			2,
		);
	});

	it('should handle different index values correctly', async () => {
		const mockParser1 = mock<auraStructuredOutputParser>();
		const mockParser2 = mock<auraStructuredOutputParser>();
		const mockParser3 = mock<auraStructuredOutputParser>();

		mockContext.getNodeParameter.mockReturnValue(true);
		mockContext.getInputConnectionData
			.mockResolvedValueOnce(mockParser1)
			.mockResolvedValueOnce(mockParser2)
			.mockResolvedValueOnce(mockParser3);

		const result1 = await getOptionalOutputParser(mockContext, 0);
		const result2 = await getOptionalOutputParser(mockContext, 1);
		const result3 = await getOptionalOutputParser(mockContext, 5);

		expect(result1).toBe(mockParser1);
		expect(result2).toBe(mockParser2);
		expect(result3).toBe(mockParser3);

		expect(mockContext.getInputConnectionData).toHaveBeenNthCalledWith(
			1,
			NodeConnectionTypes.AiOutputParser,
			0,
		);
		expect(mockContext.getInputConnectionData).toHaveBeenNthCalledWith(
			2,
			NodeConnectionTypes.AiOutputParser,
			1,
		);
		expect(mockContext.getInputConnectionData).toHaveBeenNthCalledWith(
			3,
			NodeConnectionTypes.AiOutputParser,
			5,
		);
	});

	it('should always check hasOutputParser at index 0', async () => {
		mockContext.getNodeParameter.mockReturnValue(false);

		await getOptionalOutputParser(mockContext, 3);

		// Even when called with index 3, hasOutputParser is checked at index 0
		expect(mockContext.getNodeParameter).toHaveBeenCalledWith('hasOutputParser', 0, true);
		expect(mockContext.getInputConnectionData).not.toHaveBeenCalled();
	});
});
