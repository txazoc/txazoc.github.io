#!/usr/bin/ruby -w
# -*- coding: UTF-8 -*-

module Topic
  class TopicGenerator < Jekyll::Generator
    def generate(site)
      site.pages.each { |page| puts page.name }
    end
  end
end
