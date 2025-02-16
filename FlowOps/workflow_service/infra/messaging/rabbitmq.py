import pika
import json
from app.core.config import settings
from app.core.exceptions import EventPublishError

class RabbitMQPublisher:
    def __init__(self):
        self.connection = None
        self.channel = None
        
    def connect(self):
        try:
            credentials = pika.PlainCredentials(
                settings.RABBITMQ_USER,
                settings.RABBITMQ_PASS
            )
            self.connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=settings.RABBITMQ_HOST,
                    credentials=credentials
                )
            )
            self.channel = self.connection.channel()
            self.channel.queue_declare(
                queue=settings.RABBITMQ_QUEUE,
                durable=True
            )
        except Exception as e:
            raise EventPublishError(f"Failed to connect to RabbitMQ: {str(e)}")
    
    def publish(self, event: dict):
        try:
            if not self.channel:
                self.connect()
            
            self.channel.basic_publish(
                exchange="",
                routing_key=settings.RABBITMQ_QUEUE,
                body=json.dumps(event),
                properties=pika.BasicProperties(
                    delivery_mode=2  # make message persistent
                )
            )
        except Exception as e:
            raise EventPublishError(f"Failed to publish event: {str(e)}")
        finally:
            if self.connection:
                self.connection.close()

rabbitmq = RabbitMQPublisher() 