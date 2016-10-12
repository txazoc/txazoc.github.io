#!/usr/bin/ruby -w
# -*- coding: UTF-8 -*-

require 'pathname'

module Jekyll
  class TopicGenerator < Jekyll::Generator
    include Convertible

    attr_accessor :site, :content, :data

    def generate(site)
      @site = site
      _base = File.dirname(File.dirname(Pathname.new(__FILE__).realpath))
      _topic = {}
      site.pages.each {
          |page|
        if page.path.match(/^topic\//)
          read_yaml(File.join(_base, page.dir), page.name)
          data['url'] = page.url

          if !_topic.has_key?(data['module'])
            _topic[data['module']] = Array.new
          end

          _topic[data['module']] << data
        end
      }
    end
  end
end
