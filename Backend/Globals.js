class DeadlockError extends Error {
	constructor( initiator, target, generator, next, fail, ...params ) {
		super( ...params );
		this.Initiator = initiator;
		this.Target = target;
		this.Generator = generator;
		this.Next = next;
		this.Fail = fail;
	}
}

class DeferredEntity {
	constructor( entity_id ) {
		this.EntityId = entity_id;
	}
}

module.exports = {
	DeadlockError: DeadlockError,
	DeferredEntity: DeferredEntity,
};
