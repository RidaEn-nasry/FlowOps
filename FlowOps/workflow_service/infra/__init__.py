from infra.db.mongodb import mongodb
from infra.messaging.rabbitmq import rabbitmq

mongodb.connect()
rabbitmq.connect()

__all__ = ['mongodb', 'rabbitmq']

