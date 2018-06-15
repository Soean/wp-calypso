/** @format */

/**
 * External dependencies
 */
import { get, find, map, omit } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import stepsConfig from 'signup/config/steps';
import flows from 'signup/config/flows';
import {
	SIGNUP_COMPLETE_RESET,
	SIGNUP_PROGRESS_COMPLETE_STEP,
	SIGNUP_PROGRESS_INVALIDATE_STEP,
	SIGNUP_PROGRESS_PROCESS_STEP,
	SIGNUP_PROGRESS_REMOVE_UNNEEDED_STEPS,
	SIGNUP_PROGRESS_SAVE_STEP,
	SIGNUP_PROGRESS_SET,
	SIGNUP_PROGRESS_SUBMIT_STEP,
} from 'state/action-types';
import { createReducer } from 'state/utils';
import { schema } from './schema';

const debug = debugFactory( 'calypso:state:signup:progress:reducer' );

//
// Action handlers
//
function overwriteSteps( state, { steps = [] } ) {
	return Array.isArray( steps ) ? steps : [];
}

// TODO: Write tests for this
function completeStep( state, { step } ) {
	return updateStep( { ...step, status: 'completed' } );
}

// TODO: Write tests for this
function invalidateStep( state, { step, errors } ) {
	const newStep = { ...step, errors };
	if ( find( state, { stepName: newStep.stepName } ) ) {
		return updateStep( state, newStep );
	}
	return addStep( state, { newStep } );
}

// TODO: Write tests for this
export function processStep( state, { step } ) {
	return updateStep( { ...step, status: 'processing' } );
}

function removeUnneededSteps( state, { flowName } ) {
	const flowSteps = flows.getFlow( flowName ).steps;
	return state.filter( step => flowSteps.includes( step.stepName ) );
}

// TODO: Write tests for this
function saveStep( state, { step } ) {
	if ( find( state, { stepName: step.stepName } ) ) {
		return updateStep( state, step );
	}

	return addStep( state, { step, status: 'in-progress' } );
}

// TODO: Write tests for this
function submitStep( state, { step } ) {
	const stepHasApiRequestFunction = get( stepsConfig, `${ step.stepName }.apiRequestFunction` );
	const status = stepHasApiRequestFunction ? 'pending' : 'completed';

	return updateStep( { ...step, status } );
}

//
// Helper Functions
//
function addStep( state, { step } ) {
	debug( `Adding step ${ step.stepName }` );
	return [ ...state, step ];
}

function updateStep( state, newStep ) {
	debug( `Updating step ${ newStep.stepName }` );
	return map( state, function( step ) {
		if ( step.stepName === newStep.stepName ) {
			const { status } = newStep;
			if ( status === 'pending' || status === 'completed' ) {
				// Steps that are resubmitted may decide to omit the
				// `processingMessage` or `wasSkipped` status of a step if e.g.
				// the user goes back and chooses to not skip a step. If a step
				// is submitted without these, we explicitly remove them from
				// the step data.
				return { ...omit( step, [ 'processingMessage', 'wasSkipped' ] ), ...newStep };
			}

			return { ...step, ...newStep };
		}

		return step;
	} );
}

//
// Reducer export
//
export default createReducer(
	[],
	{
		[ SIGNUP_COMPLETE_RESET ]: overwriteSteps,
		[ SIGNUP_PROGRESS_COMPLETE_STEP ]: completeStep,
		[ SIGNUP_PROGRESS_INVALIDATE_STEP ]: invalidateStep,
		[ SIGNUP_PROGRESS_PROCESS_STEP ]: processStep,
		[ SIGNUP_PROGRESS_REMOVE_UNNEEDED_STEPS ]: removeUnneededSteps,
		[ SIGNUP_PROGRESS_SAVE_STEP ]: saveStep,
		[ SIGNUP_PROGRESS_SET ]: overwriteSteps,
		[ SIGNUP_PROGRESS_SUBMIT_STEP ]: submitStep,
	},
	schema
);
