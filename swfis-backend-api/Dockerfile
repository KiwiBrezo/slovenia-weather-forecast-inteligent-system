FROM python:3.9

ENV MLFLOW_TRACKING_USERNAME=KiwiBrezo
ENV MLFLOW_TRACKING_PASSWORD=b1551df877bd6175943f4cb81882055692ff6687

WORKDIR /code

COPY ./pyproject.toml /code/pyproject.toml

RUN pip install --no-cache-dir --upgrade poetry
RUN poetry install --only main

COPY ./src /code/src

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]