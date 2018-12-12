# Lung web application visualisations

## Setup
Make sure you have Python installed, then run:

	git clone https://github.com/tdewolff/LungWebAppVisualisations.git

To launch the web application, run:

    cd LungWebAppVisualisations/
    python run.py

and open your browser at [http://localhost:8000/](http://localhost:8000/).

## Run using another web server
Since Python will compress and serve the models automatically, when running from an ordinary web server (Apache, NGINX, ...) you must enable serving pre-compressed files. Run `run.py` to generate the compressed models. If possible, set the `X-Uncompressed-Content-Length` header to the value encoded in the compressed filename. This will enable a loading percentage on screen.

