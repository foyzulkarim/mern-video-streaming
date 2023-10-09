## Services

* [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html) - For storing data 
* [APM](https://www.elastic.co/guide/en/apm/guide/current/apm-overview.html) - For tracking application performence
* [Filebeat](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-overview.html) - For Shipping log to elasticsearch 
* [Kibana](https://www.elastic.co/guide/en/kibana/8.10/introduction.html) - For visualization

## Installation

* create `.env` file in `EKA-docker` directory and populate all the required environment variable (see [`.ent.template`](.env.template) for reference)

* build the container 

  ```bash
  docker-compose up
  ```

if everything went well, you will find `kibana` running at `http://localhost:5601/`. 

To log into `kibana dashboard` use values of `ELASTICSEARCH_USERNAME` & `ELASTICSEARCH_PASSWORD` of your env variable.


#### To see application log -

From sidebar navigate to Observability > Logs

#### To see APM log -

From sidebar navigate to Observability > APM









