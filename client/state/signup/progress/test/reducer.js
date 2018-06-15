/** @format */

/**
 * Internal dependencies
 */
import flows from 'signup/config/flows';
import reducer, { addOrUpdateStep } from '../reducer';
import {
	SIGNUP_COMPLETE_RESET,
	SIGNUP_PROGRESS_REMOVE_UNNEEDED_STEPS,
	SIGNUP_PROGRESS_SET,
} from 'state/action-types';

//
// Mocks necessary to properly handle 'signup/config/steps' import
//
jest.mock( 'lib/abtest', () => ( {
	abtest: () => '',
} ) );
jest.mock( 'lib/signup/step-actions', () => ( {
	createAccount: () => {},
} ) );
jest.mock( 'lib/user', () => () => {
	return {
		get() {
			return {};
		},
	};
} );

//
// Mock necessary to properly handle 'signup/config/flows' import
//
jest.mock( 'signup/config/flows', () => ( {
	getFlow: jest.fn(),
} ) );

describe( 'reducer', () => {
	describe( 'setting and resetting the state', () => {
		test( 'should handle manually setting the state', () => {
			const initialState = [];
			const action = {
				type: SIGNUP_COMPLETE_RESET,
			};
			const finalState = [ { test: 123 } ];
			expect( reducer( initialState, action ) ).toEqual( finalState );
		} );
		test( 'should handle resetting the state', () => {
			const initialState = [];
			const action = {
				type: SIGNUP_COMPLETE_RESET,
			};
			const finalState = [ { test: 123 } ];
			expect( reducer( initialState, action ) ).toEqual( finalState );
		} );
	} );

	describe( 'completing a step', () => {
		test( 'should mark the new step with the in-progress status', () => {} );
	} );

	describe( 'adding a step', () => {
		test( 'should handle adding a step' );
	} );

	describe( 'updating a step', () => {
		test( 'should handle adding a step' );
	} );

	describe( 'invalidating a step', () => {
		test( "should append a step with error data if the step's name is unique", () => {
			const initialState = [ { stepName: 'whatever' } ];
			const action = { step: { stepName: 'something' } };
			const finalState = [ { stepName: 'whatever' }, { stepName: 'something' } ];
			expect( addOrUpdateStep( initialState, action ) ).toEqual( finalState );
		} );

		test( "should update a step with error data if the step's name is not unique", () => {
			const initialState = [ { stepName: 'something', value: 'great' } ];
			const action = { step: { stepName: 'something', anotherValue: 'also great' } };
			const finalState = [ { stepName: 'something', value: 'great', anotherValue: 'also great' } ];
			expect( addOrUpdateStep( initialState, action ) ).toEqual( finalState );
		} );

		test( 'should append the error data to the step', () => {} );
	} );

	describe( 'processing a step', () => {
		test( 'should update the step with a processing status', () => {} );
	} );

	describe( 'saving a step', () => {
		describe( 'saving a new step', () => {
			test( 'should append the new step to the state', () => {} );
			test( 'should mark the new step with the in-progress status', () => {} );
		} );
		describe( 'saving an existing step', () => {
			test( 'should update the existing step with the provided data', () => {} );
		} );
	} );

	describe( 'removing unneded steps', () => {
		test( 'should remove steps with names not included in the validStepNames array', () => {
			flows.getFlow.mockReturnValueOnce( { steps: [ 'something', 'everything' ] } );

			const initialState = [
				{ stepName: 'something', value: 'great something' },
				{ stepName: 'everything', value: 'great everything' },
				{ stepName: 'nothing', value: 'great nothing' },
				{ stepName: 'one', value: 'great one' },
			];
			const action = {
				type: SIGNUP_PROGRESS_REMOVE_UNNEEDED_STEPS,
				flowName: 'new-flow',
			};
			const finalState = [
				{ stepName: 'something', value: 'great something' },
				{ stepName: 'everything', value: 'great everything' },
			];
			expect( reducer( initialState, action ) ).toEqual( finalState );
		} );
	} );
} );
