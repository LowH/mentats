Title: Bonne Année
Author: Thomas de Grivel
Date: 2013-01-01

So here is the blog controller code

    :::common-lisp
    (defun /blog#index ()
      (template-let ((articles (blog.articles)))
        (render-view :blog :index '.html)))
    
    (defun /blog#show (article)
      (render-view :blog :show '.html))
    
    (defun /blog (&optional article)
      (when article
        (unless (setf article (find-article article))
          (http-error "404 Not found" "Blog article not found.")))
      (ecase *method*
        ((:GET)    (if article (/blog#show article) (/blog#index)))
        ((:POST)   (/blog#post))
        ((:PUT)    (/blog#update a))
        ((:DELETE) (/blog#delete a))))

Testing was never a bad thing.
