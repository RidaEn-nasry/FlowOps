class WorkflowNotFoundError(Exception):
    """Raised when a workflow cannot be found"""
    pass

class WorkflowCreationError(Exception):
    """Raised when there's an error creating a workflow"""
    pass

class DatabaseError(Exception):
    """Raised when there's a database error"""
    pass

class EventPublishError(Exception):
    """Raised when there's an error publishing an event"""
    pass 