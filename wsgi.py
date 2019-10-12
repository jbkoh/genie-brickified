from geniebackend.endpoints import app

if __name__ == '__main__':

    certificate = '/etc/letsencrypt/live/bd-testbed.ucsd.edu/fullchain.pem'
    key = '/etc/letsencrypt/live/bd-testbed.ucsd.edu/privkey.pem'
    ssl_context = (certificate, key)
    app.run(host='0.0.0.0', ssl_context=ssl_context)
