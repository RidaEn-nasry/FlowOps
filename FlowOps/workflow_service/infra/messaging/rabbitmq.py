import pika
import json
import time
from app.core.config import settings
from app.core.exceptions import EventPublishError

MAX_RETRIES = 5
RETRY_DELAY = 3

class RabbitMQPublisher:
    def __init__(self):
        self.connection = None
        self.channel = None
        
    def connect(self):
        for attempt in range(MAX_RETRIES):
            try:
                credentials = pika.PlainCredentials(settings.RABBITMQ_USER, settings.RABBITMQ_PASS)
                parameters = pika.ConnectionParameters(
                    host=settings.RABBITMQ_HOST,
                    port=settings.RABBITMQ_PORT,
                    credentials=credentials,
                    heartbeat=600
                )
                self.connection = pika.BlockingConnection(parameters)
                self.channel = self.connection.channel()
                self.channel.queue_declare(
                    queue=settings.RABBITMQ_QUEUE,
                    durable=True
                )
                print("Successfully connected to RabbitMQ")
                return
            except Exception as e:
                if attempt < MAX_RETRIES - 1:
                    print(f"Connection attempt {attempt + 1} failed. Retrying in {RETRY_DELAY} seconds...")
                    time.sleep(RETRY_DELAY)
                    continue
                raise EventPublishError(f"Failed to connect to RabbitMQ after {MAX_RETRIES} attempts: {str(e)}")
    
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