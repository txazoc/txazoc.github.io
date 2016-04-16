#!/usr/bin/ruby -w
# -*- coding: UTF-8 -*-

BEGIN {
    puts "init"
}

puts "Hello World"

print <<EOF
Hello World
Hello World
EOF

array = [1, 2, 3]
array.each do |i|
    puts i
end
puts array[0]

hash = {"name" => "root"}
hash.each do |key, value|
    puts key, " is ", value
end

(10..15).each do |n|
    puts n
end

class Parent
    @id = 0
    @name

    def initialize(id, name)
        @id = id
        @name = name
    end

    def printName()
        puts @name
    end
end

p = Parent.new(1, "root")
p.printName

END {
    puts "end "
}
