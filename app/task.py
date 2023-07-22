from app.service_v3 import PhotoPreparation
from mysite.celery import app
from channels.layers import get_channel_layer
import asyncio
from .models import UserFile
from asgiref.sync import async_to_sync, sync_to_async
from time import sleep


@app.task
def process_photos(session_key, uploaded_files):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        session_key,
        {
            "type": "celery_task_update",
            "data": {
                "progress": 0.1,
                "event": "started",
            },
        },
    )
    user_files = UserFile.objects.filter(id__in=uploaded_files)
    for file in user_files:
        photo_size = file.prepared_for
        file_path = file.file.path
        file_id = file.id
    service = PhotoPreparation(
        photo_size,
        file_path,
        session_key,
        file_id,
    )
    service.make()

    async_to_sync(channel_layer.group_send)(
        session_key,
        {
            "type": "celery_task_update",
            "data": {
                "progress": 0.8,
                "event": "finished",
            },
        },
    )


from asgiref.sync import sync_to_async


from asgiref.sync import sync_to_async


from asgiref.sync import sync_to_async


async def process_photos_v2(session_key, uploaded_files):
    user_files = await sync_to_async(list)(
        UserFile.objects.filter(id__in=uploaded_files)
    )

    for file in user_files:
        photo_size = file.prepared_for
        file_path = await sync_to_async(getattr, thread_sensitive=True)(
            file.file, "path"
        )
        file_id = await sync_to_async(getattr, thread_sensitive=True)(file, "id")
        service = PhotoPreparation(
            photo_size,
            file_path,
            session_key,
            file_id,
        )
        # assuming service.make() does not perform any DB operations,
        # otherwise it also needs to be run in sync_to_async
        await service.make()
