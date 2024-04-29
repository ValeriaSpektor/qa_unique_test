import { EntityManager } from 'typeorm';
import { IsUniqueColumnInTableConstraint } from './IsUniqueColumnInTableConstraint';

describe('IsUniqueColumnInTableConstraint', () => {
  let entityManager: EntityManager;
  let validator: IsUniqueColumnInTableConstraint;

  beforeEach(() => {
    // Creating a mock EntityManager and an instance of the validator before each test
    entityManager = {
      getRepository: jest.fn().mockReturnThis(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getExists: jest.fn().mockResolvedValue(true), 
    } as unknown as EntityManager; 
    validator = new IsUniqueColumnInTableConstraint(entityManager);
  });

  it('should return true if value is unique in the specified column', async () => {
    // Testing validation of a unique value
    const value = 'uniqueValue';
    const result = await validator.validate(value, { constraints: [{ table: 'tableName' }] });
    expect(result).toBe(true);
  });

  it('should return false if value is not unique in the specified column', async () => {
    // Testing validation of a non-unique value
    const value = 'nonUniqueValue';
    const result = await validator.validate(value, { constraints: [{ table: 'tableName' }] });
    expect(result).toBe(false);
  });

  it('should handle asynchronous database queries correctly', async () => {
    // Simulating the behavior of an asynchronous database query
    const fakeEntityManager = {
      getRepository: jest.fn().mockReturnThis(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getExists: jest.fn().mockResolvedValueOnce(true), // Assume the query returns true
    } as unknown as EntityManager; // Type assertion to EntityManager

    // Creating an instance of the validator constraint with the fake entity manager
    const validator = new IsUniqueColumnInTableConstraint(fakeEntityManager);

    // Validating a value (which may trigger an asynchronous database query)
    const isValid = await validator.validate('someValue', { constraints: [{ table: 'tableName' }] });

    // Expecting the validation result to be true
    expect(isValid).toBe(true);
  });

  it('should return error message for invalid data', async () => {
    // Simulating the behavior of an asynchronous database query
    const fakeEntityManager = {
      getRepository: jest.fn().mockReturnThis(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getExists: jest.fn().mockResolvedValueOnce(false), // Assume the query returns false
    } as unknown as EntityManager; // Type assertion to EntityManager

    // Creating an instance of the validator constraint with the fake entity manager
    const validator = new IsUniqueColumnInTableConstraint(fakeEntityManager);

    // Validating a value (which may trigger an asynchronous database query)
    const isValid = await validator.validate('duplicateValue', { constraints: [{ table: 'tableName' }] });

    // Expecting the validation result to be false
    expect(isValid).toBe(false);

    // Getting the default error message
    const errorMessage = validator.defaultMessage({ constraints: [{ table: 'tableName' }] });

    // Expecting the error message to be generated correctly
    expect(errorMessage).toBe('Value must be unique in the table "tableName" for column "columnName".');
  });
});
